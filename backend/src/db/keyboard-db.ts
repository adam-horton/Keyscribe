import { queryPool } from './db-setup';

/**
 * Checks if the hardware id belongs to a valid board
 * @param id The hardware id to check
 * @returns True if the hardware id belongs to a valid board
 */
const validateHardwareId = async (id: number): Promise<boolean> => {
  const query = `
      SELECT 1
      FROM known_hardware_ids
      WHERE id = $1`;

  const result = await queryPool(query, [id]);

  return result.rows.length !== 0;
};

/**
 * Returns the PID associated with the PI if it exists,
 * otherwise returns -1
 * @param hardwareId The hardware id of the PI
 * @returns Returns the PID associated with the PI if it exists, otherwise -1
 */
const getPID = async (hardwareId: number): Promise<number> => {
  const select = `
      SELECT id
      FROM keyboards
      WHERE hardware_id = $1`;

  const pid = await queryPool(select, [hardwareId]);

  if (pid.rows.length !== 0) {
    return pid.rows[0].id;
  }
  return -1;
};

/**
 * Returns the id of the owner of the keyboard, otherwise null
 * @param pid The pid of the Pi
 * @returns The uuid of the owner
 */
const getOwner = async (pid: number): Promise<string> => {
  const select = `
      SELECT owner
      FROM keyboards
      WHERE id = $1`;

  const owner = await queryPool(select, [pid]);

  if (owner.rows[0].owner) {
    return owner.rows[0].owner;
  }
  return '';
};

/**
   * Sets the user as the owner of the keyboard
   * @param userId The id of the user claiming the keyboard
   * @param hardwareId The hardware_id of the keyboard
   * @param name The name of the keyboard
   * @returns True if successful
   */
const setOwner = async (userId: string, hardwareId: number, name: string): Promise<number> => {
  const update = `
      UPDATE keyboards
      SET owner = $1, name = $3
      WHERE owner IS NULL AND hardware_id = $2
      RETURNING id`;

  const result = await queryPool(update, [userId, hardwareId, name]);

  if (result.rows.length === 0) {
    return -1;
  }

  return result.rows[0].id;
};

/**
   * Creates a new keyboard and assigns it a PID
   * @param hardwareId The hardware id of the Pi
   * @returns the PID of the keyboard
   */
const createKeyboard = async (hardwareId: number): Promise<number> => {
  const insert = `
      INSERT INTO keyboards(id, hardware_id)
      VALUES ($1, $2)`;

  const newId = Math.floor(Math.random() * 99999999);

  await queryPool(insert, [newId, hardwareId]);

  return newId;
};

/**
 * Returns all other keyboards a keyboard is connected to
 * @param id The keyboard whose connections you want to find
 * @returns A list of keyboard IDs that this keyboard is connected to
 */
const getConnectedKeyboards = async (id: number): Promise<number[]> => {
  const select = `
      SELECT id
      FROM keyboards
      WHERE session_id = (SELECT session_id FROM keyboards WHERE id = $1) AND id != $1`;

  const result = await queryPool(select, [id]);

  const connectedIds: number[] = [];

  result.rows.forEach((row) => {
    connectedIds.push(row.id);
  });

  return connectedIds;
};

/**
 * Creates a new session with the user as the owner, a name, and the PID of a keyboard as the teacher
 * @param userId The id of the user creating the session
 * @param pid The PID of the teacher keyboard
 * @param name The name of the session
 * @returns The ID of the new session
 */
const createSession = async (userId: string, pid: number, name: string): Promise<number> => {
  const selectQuery = `
    SELECT session_id AS "sessionId"
    FROM keyboards
    WHERE id = $1;
  `;

  const currentSession = await queryPool(selectQuery, [pid]);
  if (currentSession.rows[0].sessionId !== null) {
    return -1;
  }

  // Create the new session and make the keyboard the teacher
  const query = `
    WITH new_id AS (
      INSERT INTO keyboard_sessions
      VALUES ($4, $3, $1)
      RETURNING id
    )
    UPDATE keyboards
    SET session_id = (SELECT id FROM new_id), role = 'teacher'
    WHERE id = $2
    RETURNING session_id as "sessionId";
  `;

  const newId = Math.floor(Math.random() * 99999999);

  const sessionId = await queryPool(query, [userId, pid, name, newId]);

  return (sessionId.rows.length === 0) ? -1 : sessionId.rows[0].sessionId;
};

/**
 * Tries to join a session with the specified keyboard. Ensures keyboard belongs to user first
 * @param userId The user requesting to join
 * @param pid The pid of the keyboard requesting to join
 * @param sessionId The session ID of the session the user wants to join
 * @returns True if successful
 */
const joinSession = async (pid: number, sessionId: number): Promise<boolean> => {
  const query = `
    UPDATE keyboards
    SET session_id = $2, role = 'student'
    WHERE id = $1 AND ($2 IN (SELECT id FROM keyboard_sessions)) AND session_id IS NULL
    RETURNING session_id AS "sessionId";
  `;

  const result = await queryPool(query, [pid, sessionId]);

  return result.rows.length === 1;
};

/**
 * Removes a keyboard from a session
 * @param pid The keyboard the user is trying to leave with
 * @returns True if successful
 */
const leaveSession = async (pid: number): Promise<boolean> => {
  const query = `
    UPDATE keyboards
    SET session_id = NULL, role = NULL
    WHERE id = $1 AND session_id IS NOT NULL AND role != 'teacher'
    RETURNING id;
  `;

  const result = await queryPool(query, [pid]);

  return result.rows.length === 1;
};

/**
 * Attempts to close a session and returns true if successful
 * @param userId The user trying to close the session
 * @param sessionId The id of the session to close
 * @returns True if successful
 */
const closeSession = async (userId: string, sessionId: number): Promise<boolean> => {
  const query = `
    WITH deleted_session AS (
      SELECT id FROM keyboard_sessions WHERE id = $2 AND owner = $1
    ),
    updated_keyboards AS (
      UPDATE keyboards SET session_id = NULL, role = NULL WHERE session_id=(SELECT id FROM deleted_session) RETURNING id
    )
    DELETE FROM keyboard_sessions WHERE id = (SELECT id FROM deleted_session) RETURNING id;
  `;

  const result = await queryPool(query, [userId, sessionId]);

  return result.rows.length >= 1;
};

/**
 * Gets all keyboards belonging to a user
 * @param id The id of the user
 * @returns A list of keyboards in the form [{id1, name1, selected1}, {id2, name2, selected2}...]
 */
const getKeyboards = async (id: string): Promise<any[]> => {
  const query = 'SELECT id, selected, name FROM keyboards WHERE owner = $1';

  const result = await queryPool(query, [id]);

  return result.rows;
};

/**
 * Returns the user's selected keyboard
 * @param id The id of the user
 * @returns An object with the id and name of the selected keyboard
 */
const getActiveKeyboard = async (id: string): Promise<any> => {
  const query = 'SELECT id, name FROM keyboards WHERE owner = $1 AND selected=True';

  const result = await queryPool(query, [id]);

  return result.rows[0];
};

const setActiveKeyboard = async (userId: string, pid: number): Promise<boolean> => {
  const query = `
    UPDATE keyboards 
    SET selected = CASE 
      WHEN id = $1 THEN true 
      ELSE false 
    END
    WHERE owner = $2
    RETURNING id`;

  const result = await queryPool(query, [pid, userId]);

  return result.rows.length >= 1;
};

const getSessionId = async (boardId: number): Promise<number> => {
  const query = 'SELECT session_id as "sessionId" FROM keyboards WHERE id = $1';

  const result = await queryPool(query, [boardId]);

  return (result.rows.length === 0) ? -1 : result.rows[0].sessionId;
};

const startRecording = async (boardId: number): Promise<boolean> => {
  const query = 'UPDATE keyboards SET recording=\'true\' WHERE id=$1 AND recording=\'false\' RETURNING id;';

  const result = await queryPool(query, [boardId]);

  return result.rows.length === 1;
};

const stopRecording = async (boardId: number, userId: string, name: string): Promise<number> => {
  console.log("stopRecording reached");
  // This query updates the recording status of the keyboard and creates a new recording entry.
  // It will do neither if the keyboard is not currently recording
  const query = `
  WITH stop_recording AS (
    UPDATE keyboards
    SET recording='false'
    WHERE id=$4 AND recording='true'
    RETURNING $1::integer AS recording_id
  )
  INSERT INTO recordings(id, name, creator)
  SELECT recording_id, $2, $3
  FROM stop_recording
  RETURNING id;`;

  const newId = Math.floor(Math.random() * 99999999);

  const result = await queryPool(query, [newId, name, userId, boardId]);

  return (result.rows.length === 1) ? result.rows[0].id : -1;
};

const uploadFile = async (file: Buffer, recordingId: number): Promise<boolean> => {
  const query = 'UPDATE recordings SET data=$1 WHERE id=$2 AND data IS NULL RETURNING id;';

  const result = await queryPool(query, [file, recordingId]);

  return result.rows.length === 1;
};

const getRecording = async (recId: number, userId: string): Promise<{name: string|null, recording: string|null}> => {
  const query = 'SELECT name, data FROM recordings WHERE creator = $1 AND id = $2';

  const result = await queryPool(query, [userId, recId]);

  if (result.rows.length === 1) {
    return { name: result.rows[0].name, recording: result.rows[0].data.toString('base64') };
  }
  return { name: null, recording: null };
}

export {
  validateHardwareId,
  getPID,
  getOwner,
  setOwner,
  createKeyboard,
  getConnectedKeyboards,
  createSession,
  joinSession,
  leaveSession,
  closeSession,
  getKeyboards,
  getActiveKeyboard,
  setActiveKeyboard,
  getSessionId,
  startRecording,
  stopRecording,
  uploadFile,
  getRecording,
};
