import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({selectedUser,setSelectedUser}) => {

  const scrollEnd = useRef();
  // No need for useEffect with flex-col-reverse as it automatically shows latest messages
  return selectedUser ?(
    <div className='h-full relative backdrop-blur-lg'>
      {/* Fixed Header */}
      <div className='fixed top-0 left-0 right-0 z-10 flex items-center gap-3 py-3 px-4 border-b border-stone-500 bg-inherit'>
        <img src={assets.profile_martin} alt="" className='w-8 rounded-full ' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          Martin Johnson
          <span className='w-2 h-2 rounded-full bg-green-500'></span>
        </p>
        <img onClick={()=>setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5' />
      </div>
      {/* ---------------chat area------------------------- */}
      <div className='absolute top-[60px] bottom-[70px] left-0 right-0 overflow-y-auto flex flex-col-reverse'>
        <div className='flex flex-col p-3 w-full'>
          {messagesDummyData.map((msg,index)=>(
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId!=='680f50e4f10f3cd28382ecf9' && 'flex-row-reverse'}`}>
            {msg.image?(
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ):(
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId==='680f50e4f10f3cd28382ecf9'?'rounded-br-none':'rounded-bl-none'} `}>
                {msg.text}
              </p>
            )}
            <div className='text-center text-xs'>
              <img src={msg.senderId==='680f50e4f10f3cd28382ecf9'?assets.avatar_icon:assets.profile_martin} alt="" className='w-7 rounded-full ' />
              <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
          <div ref={scrollEnd}></div>
        </div>
      </div>

      {/* ---------------bottom area------------------------- */}
      <div className='fixed bottom-0 left-0 right-0 z-10 py-3 px-4 bg-inherit border-t border-stone-500'>
        <div className='flex items-center gap-3'>
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
            <input type="text" placeholder='Send a message' 
            className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'/>
            <input type="file" id='image' accept='image/png,image/jpeg' className='hidden' />
            <label htmlFor="image">
              <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer hover:opacity-80'/>
            </label>
          </div>
          <img src={assets.send_button} alt="" className='w-7 cursor-pointer' />
        </div>
      </div>
    </div>
  ):(
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden '>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime anywhere</p>
    </div>
  )
}

export default ChatContainer;
