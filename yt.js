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
    bot.sendMessage(chatid,"𝙏𝙝𝙞𝙨 𝙢𝙖𝙮 𝙩𝙖𝙠𝙚 𝙛𝙚𝙬 𝙢𝙤𝙢𝙚𝙣𝙩𝙨")
await bot.sendMessage(chatid,"𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙𝙞𝙣𝙜 𝙫𝙞𝙙𝙚𝙤 : [ "+
title + " ]")
 save.on("finish",()=>{
   let limit = 60746562
  fs.stat(video,(err,data)=>{
     if(!err){
       if(data.size < limit){
         bot.sendVideo(chatid,video,{caption:title,thumb : thumbnail})
       }else{
         bot.sendMessage(chatid,"𝙨𝙤𝙧𝙧𝙮! 𝙘𝙖𝙣𝙣𝙤𝙩 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙢𝙤𝙧𝙚 𝙩𝙝𝙖𝙣 60𝙢𝙗 𝙛𝙞𝙡𝙚")
       }
     }
   })
   //
  // console.log(info.videoDetails.thumbnails[0].url)
    
 }) 
  }catch(err){
    console.log(err)
bot.sendMessage(chatid,"𝚜𝚘𝚛𝚛𝚢! 𝚊𝚗  𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚎𝚍 𝚙𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚎𝚌𝚔 𝚞𝚛𝚕 𝚘𝚛 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚏𝚎𝚠 𝚖𝚒𝚗𝚞𝚝𝚎𝚜 𝚕𝚊𝚝𝚎𝚛")
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
𝙃𝙞! ${msg.chat.username}
𝙏𝙝𝙞𝙨 𝙗𝙤𝙩 𝙞𝙨 𝙪𝙨𝙚 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙮𝙤𝙪𝙩𝙪𝙗𝙚 𝙫𝙞𝙙𝙚𝙤𝙨
𝙗𝕠𝙩 𝙘𝙧𝙚𝙖𝙩𝙚𝙙 𝙗𝙮 @rifas11
`,key)

}else if(message == "𝔸𝕓𝕠𝕦𝕥"){
     bot.sendMessage(chatId,"𝔹𝕠𝕥 ℂ𝕣𝕖𝕒𝕥𝕖𝕕 𝕓𝕪 @rifas11")
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