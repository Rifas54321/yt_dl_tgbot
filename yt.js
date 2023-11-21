const express = require("express");
require("dotenv").config();
const ytdl = require('ytdl-core');
const fs = require("fs")
const Telegram = require("node-telegram-bot-api")
const path = require("path")
//const url ="https://youtu.be/ecTwHhLbqho?si=iTdh5eLHOl87_7dL";
const app = express();
const token = process.env.bot_token
const bot = new Telegram(token,{polling:true})
app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname,"public/alive.html"))
})
let title ="";
async function video_dl(chatid,url){
  try{
  let info = await ytdl.getInfo(url)
  title = await info.videoDetails.title;
  let video = await path.join(__dirname,`cache/${title}${chatid}.mp4`)
  let thumbnail = info.videoDetails.thumbnails[0].url
  let save = fs.createWriteStream(`cache/${title}${chatid}.mp4`)
  ytdl(url,{filter:"audioandvideo"}).pipe(save)
    bot.sendMessage(chatid,"this may take few moments")
await bot.sendMessage(chatid,"Downloading video : [ "+ title + " ]")
 save.on("finish",()=>{
   let limit = 60746562
  fs.stat(video,(err,data)=>{
     if(!err){
       if(data.size < limit){
         bot.sendVideo(chatid,video,{caption:title,thumb : thumbnail})
       }else{
         bot.sendMessage(chatid,"sorry! cannot download more than 60mb file")
       }
     }
   })
   //
  // console.log(info.videoDetails.thumbnails[0].url)
    
 }) 
  }catch(err){
    console.log(err)
bot.sendMessage(chatid,"sorry! an  error occured please check url or try again few minutes later")
  }
}
bot.on("message",async(msg)=>{
   let message = msg.text;
   let chatId = msg.chat.id;
   if(message =="/start"){
     var key = {
  reply_markup:{
    resize_keyboard:true,
    keyboard:[[{text:"𝔸𝕓𝕠𝕦𝕥"}]]
  }
}
     bot.sendMessage(chatId,`
Hi! ${msg.chat.username}\n
bot created by @rifas11\n
just send youtube video url`,key)

}else if(message == "About"){
     bot.sendMessage(chatId,"About")
   }else{
     console.log(message)
try{
if(message.startsWith("https://youtube.com")){
      video_dl(chatId,message)
}
else if(message.startsWith("youtube.com")){
     let e_message = "https://"+message
     video_dl(chatId,e_message)
}
else{
       bot.sendMessage(chatId,"invalid url")
 }
   // await bot.sendVideo(chatId,`cache/${title}${chatId}.mp4`)
   }catch(err){
     console.log(err)
     bot.sendMessage(chatId,"no video found")
   }
   
   }
})
app.listen(3200,()=>{console.log("server running in port 3200")})