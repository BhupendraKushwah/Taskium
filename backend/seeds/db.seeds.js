import {createProfessionTable,createSocialTable,createUserDeviceLoginTable,createUserTable} from '../models/userModel.js'
import {createAttendanceTable} from '../models/attendanceModel.js'
import {createNotificationTable} from '../models/notificationModel.js'
import {createProjectTable} from '../models/projectModel.js'
import {createTaskTable} from '../models/taskModel.js'
import logger from '../config/logger.js'
const TableSeeds = async () => {
  try {
    // Create in order based on foreign key dependencies
    await createUserTable();              // must come first
    await createProfessionTable();        // safe after users
    await createSocialTable();            // safe after users
    await createUserDeviceLoginTable();   // safe after users
    await createAttendanceTable();        // references users
    await createProjectTable();           // likely independent
    await createTaskTable();              // might depend on projects or users
    await createNotificationTable();      // likely independent

    return true;
  } catch (error) {
    logger.error({
      message: error.message,
      stack: error.stack,
      filepath: '/seeds/db.seeds.js',
      function: 'TableSeeds'
    });
    throw error;
  }
};


export default TableSeeds