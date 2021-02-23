import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = ()=>{
  let list = localStorage.getItem('list');
  if (list){
    return JSON.parse(localStorage.getItem('list'))
  }
  else{
    return []
  }
}

function App() {
  const [name,setName] = useState(''); {/* empty string is always false*/}
  const [list,setList]= useState(getLocalStorage());
  const [isEditing,setIsEditing] =useState(false);
  const[editId,setEditId]=useState(null);
  const[alert,setAlert]=useState({show:false,msg:'',type:''});
 
  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!name){
      //display alert
      showAlert(true,'danger','Please Enter Value')
    }
    else if(name && isEditing){
      setList(list.map((item)=>{
        if(item.id === editId){
          return {...item,title:name}
        }
        return item
      }))
      setName('');
      setEditId(null);
      setIsEditing(false);
      showAlert(true,'success','Item Edited..')
    }

    else{
      //add to list adn show alert
      showAlert(true,'success','Item added..')
      const newItem = {id:new Date().getTime().toString(),title:name};
      setList([...list,newItem]);
      setName('')
    }

  }



  const showAlert = (show=false,type='',msg='')=>{
    setAlert({show,type,msg})

  }

  const clearList =()=>{
    showAlert(true,'danger','Empty list...')
    setList([])
  }
  const removeItem =(id)=>{
    showAlert(true,'danger','Item Removed...')
    setList(list.filter((item)=>item.id !== id))  //if id matches  doesnt get added to new list
  }

  const editItem = (id) =>{
    const specificItem = list.find((item)=>item.id === id);  //if id matches return that id
      setIsEditing(true);
      setEditId(id);
      setName(specificItem.title);

  }

  useEffect(()=>{
    localStorage.setItem('list',JSON.stringify(list))
  },[list])

 return (<section className='section-center'>
   <form className='grocery-form' onSubmit={handleSubmit} >
      {/* both true alert comp works else wont  for && op*/}
      {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}  
      <h3>Todo List</h3> 
      <div className='form-control'>
        <input type='text' className='gocery' placeholder='eg. eggs'  value={name} onChange={(e)=>setName(e.target.value)}></input>
        <button type='submit' className='submit-btn'>
          {isEditing ? 'edit':'submit'}
        </button>
      </div>

   </form>
  {list.length>0 &&(

        <div  className='grocery-container'>
        <List items={list} removeItem={removeItem} editItem={editItem}/>
        <button className='clear-btn' onClick={clearList} >clear Items</button>
      </div>
  )}
    </section>
  )}

export default App
