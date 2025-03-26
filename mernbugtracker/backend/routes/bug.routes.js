import {Router} from 'express';
import Bug from "../models/bugs.js";
const router = Router();

router.get('/', async (req, res) => {
    try{
        const bugs = await Bug.find();
    res.json(bugs);
    } catch(er){
        res.status(400).json({ message: 'Invalid request' });
    }

});

router.post('/', async (req, res) => {
    try{
        const newBug = new Bug(req.body);
    await newBug.save();
    res.status(201).json(newBug);
    } catch(er){
        res.status(400).json({ message: 'Invalid bug data' });
    }
});

router.put('/:id', async (req, res) => {
    try{
        const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBug);
    } catch(er){
        res.status(400).json({ message: 'Invalid bug ID' });
    }
});

router.delete('/:id', async (req, res) => {
   try{
    await Bug.findByIdAndDelete(req.params.id);
    res.json({ message: 'Bug deleted' });
   } catch(er){
    res.status(400).json({ message: 'Invalid bug ID' });
   }
});

export default router;