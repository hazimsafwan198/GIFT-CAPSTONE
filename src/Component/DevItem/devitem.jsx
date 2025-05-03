import React, {useState} from 'react'
import axios from 'axios'

const devitem = () => {
  const [input, setInput] = useState({
    name: '',
    desc1: '',
    desc2: '',
    id: '',
    type: '',
    points: '',
    img: ''
  });
  const [error, setError] = useState('');

  function handleChange(event){
    const {name, value} = event.target;
    setInput(prevInput =>{
      return {
        ...prevInput,
        [name]: value
      }
    })
  }

  async function handleClick(event){
    event.preventDefault();

    //Check if any field is empty, use trim to ignore white spaces
    if(Object.values(input).some(value => !value.trim() )){
      alert('Please fill all the fields');
      return;
    }

    const newItemData = {
      item_name: input.name,
      item_desc1: input.desc1,
      item_desc2: input.desc2,
      item_id: input.id,
      item_type: input.type,
      item_points: input.points,
      item_img: input.img
    };

    try{
      const response = await axios.post('http://localhost:5000/item/devItem', newItemData);
      alert(`Item Inserted Successfully!`);
      setError('');
    }catch(err){
      console.error('Error during registration:', err);
      setError('Error inserting item');
    }
  }
  return (
    <div className='reg'>
      <h1>Insert Item</h1>
      <form onSubmit={handleClick}>
        <input type='text' name='name' value={input.name} onChange={handleChange} placeholder='Item Name'/>
        <input type='text' name='desc1' value={input.desc1} onChange={handleChange} placeholder='Item Description'/>
        <input type='text' name='desc2' value={input.desc2} onChange={handleChange} placeholder='Item Description'/>
        <input type='text' name='id' value={input.id} onChange={handleChange} placeholder='Item ID'/>
        <input type='text' name='type' value={input.type} onChange={handleChange} placeholder='Item Type'/>
        <input type='text' name='points' value={input.points} onChange={handleChange} placeholder='Item Points'/>
        <input type='text' name='img' value={input.img} onChange={handleChange} placeholder='Item Image URL'/>
        <button type="submit">Insert Item</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}

export default devitem
