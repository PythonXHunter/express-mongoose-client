const express = require('express')
const app = express()
const { connectDB } = require('./db/connect')
const Task = require('./models/tasks')
require('dotenv').config()

app.use(express.json())

const port = process.env.PORT || 3000

app.get('/', async (req, res) => {
	const task = await Task.find({})
	res.status(200).json({ task })
})

app.post('/', async (req, res) => {
	const task = await Task.create(req.body)
	res.status(201).json({ task, msg: "Success" })
})

app.delete('/:_id', async (req, res) => {
  try {
  	// console.log(req.params)
    const { _id: taskId } = req.params;
    // console.log({_id: taskId})
    const task = await Task.findOneAndDelete({ _id: taskId });
    if (!task) {
      console.log("Data is not deleted!");
      return res.status(404).json({ msg: "Data not found!" });
    }
    res.status(200).json({ task, msg: "Data is deleted!" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
})

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`Server is listening on port ${port}...`)
		})
	} catch (err){
		console.log(err)
	}
}

start();