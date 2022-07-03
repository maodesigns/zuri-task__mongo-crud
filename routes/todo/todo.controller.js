const {
    getAlltasks,
    existsTaskWithId,
    abortTaskById,
    scheduleNewtask
} = require('../../src/models/todo.model');

async function httpGetAllTasks(req, res) {
    return res.status(200).json(await getAlltasks())
}

async function httpAddNewTask(req, res) {
    const task = req.body
    if (!task.title || !task.description) {
        return res.status(400).json({
            error: "Missing required task properties"
        })
    }
    await scheduleNewtask(task)
    return res.status(201).json(task)
}

async function httpEditTask(req, res) {
    const taskId = Number(req.params.id)
    const updatedTask = req.body;

    //get existing task
    const task = await getExistingTask(taskId);

    //check for invalid task
    if (!existsTaskWithId(taskId)) {
        return res.status(404).json({
            error: "task not found"
        })
    }

    //update task by id
    updateExistingtask(taskId, updatedTask)

    return res.status(201).json(task);
}

async function httpAbortTask(req, res) {
    const taskId = Number(req.params.id)

    const existstask = await existsTaskWithId(taskId);

    if (!existstask) {
        return res.status(404).json({
            error: "task not found"
        })
    }

    const aborted = await abortTaskById(taskId)

    if (!aborted) {
        return res.status(404).json({
            error: "task not aborted"
        })
    }
    return res.status(200).json({
        acknowledged: true
    })
}


module.exports = {
    httpEditTask,
    httpGetAllTasks,
    httpAddNewTask,
    httpAbortTask,
};