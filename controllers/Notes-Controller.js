const Notes = require("../modals/notes");
const express = require('express');
const app = express();
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const middleware = require('../middleware/userauth');


router.post('/createNote',[
  body('Note').notEmpty().withMessage('Please enter a valid Note'),
  body('Type').notEmpty().withMessage('Please enter a valid Type'),
],middleware,async (req,res)=>{

 const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        try{
        const {Note,Type} = req.body;
          const  note = new Notes({
                userId : req.user.id,
                Note : Note,
                Type:Type,
            });

            await note.save();
            res.status(200).json({note,message:"Note Created Successfully"});
        }catch(err){
                res.status(500).json({error:"Internal Server Error"});
                console.log(err);
        }
});

router.patch('/UpdateNote/:id',middleware,async (req,res)=>{
    try{

    const id = req.params.id;

    const {Notess,Type} = req.body;

    const NewNote = {};

    if(Notess){
        NewNote.Notes = Notess;
    }
    if(Type){
        NewNote.Type = Type;
    }

    let Note = await Notes.findByIdAndUpdate(id,{$set:NewNote},{new:true});

    res.status(200).json({Note,Massage : "Updated Successfully"});
}catch(err){
    res.status(500).json({error:"Internal Server Error"});
}
})


router.delete('/Delete-Note/:id',middleware,async (req,res)=>{
    try{

    const id = req.params.id;

    let Note = await Notes.findByIdAndDelete(id);

    res.status(200).json({Note,Massage : "Deleted Successfully"});
}catch(err){
    res.status(500).json({error:"Internal Server Error"});
}
})

router.get('/Get-Notes/:id',middleware,async (req,res)=>{
    try {
        const Id = req.params.id;
        const AllNotes = await Notes.find({userId:Id});
        res.status(200).json({Massage : "All Notes fetched",AllNotes});
    } catch (error) {
        
    }
})


module.exports = router;