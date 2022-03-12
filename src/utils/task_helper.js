import * as TaskManager from 'expo-task-manager';
import { TASK_FETCH_LOCATION } from '../screens/DashboardScreen';

export const isTaskRunning = async () => {
    var tasks = await TaskManager.getRegisteredTasksAsync();
    var run = false;
    if(tasks) {
        for (let i = 0; i < tasks.length; i++) {
            const tt = tasks[i];
            if(tt?.taskName == TASK_FETCH_LOCATION) {
                run = true;
                break;
            }
        }
    }
    if (run) return true;
    else return false;
}