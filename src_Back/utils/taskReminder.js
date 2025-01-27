const cron = require('node-cron')

const Task = require('../models/Task')

const sendEmail = require('./emailService')
const { Error } = require('mongoose')

const io = require('../server').io


const checkTasksAndSendReminders = async () => {
    try {
        const now = new Date()
        const fiveHoursLater = new Date(now.getTime() + 5 * 60 * 60 * 1000)
        const tasks = await Task.find({
            dueDate: { $lte: fiveHoursLater, $gte: now },
            completed: false,
            reminderSent: false

        }).populate('user', 'email')


        for (const task of tasks){

            const emailText = `Dear ${task.user.email},\n\n
            You have an upcoming task:\n\n
            **Task Title:** ${task.title}\n
            **Description:** ${task.description}\n
            **Due Date:** ${task.dueDate.toLocaleString()}\n\n
            Please ensure that the task is completed on time.\n\n
            Best regards,\nYour Task Management System`

            const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #4CAF50; text-align: center;">Task Reminder</h1>
                <p>Dear ${task.user.email},</p>
                <p>You have an upcoming task:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin-bottom: 10px;">
                        <strong style="color: #4CAF50;">Task Title:</strong> ${task.title}
                    </li>
                    <li style="margin-bottom: 10px;">
                        <strong style="color: #4CAF50;">Description:</strong> ${task.description}
                    </li>
                    <li style="margin-bottom: 10px;">
                        <strong style="color: #4CAF50;">Due Date:</strong> ${task.dueDate.toLocaleString()}
                    </li>
                </ul>
                <p>Please ensure that the task is completed on time.</p>
                <p>Best regards,</p>
                <p style="font-weight: bold; color: #4CAF50;">Your Task Management System</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="http://yourfrontendurl.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Task</a>
                </div>
            </div>
        `;
        
            await sendEmail(task.user.email, 'Reminder: Upcoming Task',emailText, emailHtml)

            io.emit('taskReminder', {
                userId: task.user._id,
                message: `You have an upcoming task: ${task.title}. Due on: ${task.dueDate.toLocaleString()}`
            })

            task.reminderSent = true
            await task.save()
        }

    }
    catch(error){
        console.log("filed sande mail", error)
    }

}

cron.schedule('0 * * * *', () => { 
    checkTasksAndSendReminders()
})      



module.exports = checkTasksAndSendReminders

