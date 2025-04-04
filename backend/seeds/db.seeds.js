import {createProfessionTable,createSocialTable,createUserDeviceLoginTable,createUserTable} from '../models/userModel.js'
import {createAttendanceTable} from '../models/attendanceModel.js'
import {createNotificationTable} from '../models/notificationModel.js'
import {createProjectTable} from '../models/projectModel.js'
import {createTaskTable} from '../models/taskModel.js'
import logger from '../config/logger.js'
const TableSeeds = async () => {
    try {
      // Array of table creation promises
      const tableCreationPromises = [
        createUserTable(),
        createAttendanceTable(),
        createNotificationTable(),
        createProjectTable(),
        createTaskTable(),
        createProfessionTable(),
        createSocialTable(),
        createUserDeviceLoginTable()
      ];
  
      // Execute all table creations concurrently
      await Promise.all(tableCreationPromises);
    
      
      return true;
    } catch (error) {
      logger.error({
        message: error.message,
        stack: error.stack,
        filepath: '/seeds/db.seeds.js',
        function: 'TableSeeds'
      });
      throw error; // Re-throw to allow handling by caller
    }
  };

export default TableSeeds