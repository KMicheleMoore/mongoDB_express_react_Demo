import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../css/plantform.css';
import authService from '../services/authService';
import speciesService from '../services/speciesService';

const EditForm = ({ updateMessage }) => {
    // Hooks for form and state
    const navigate = useNavigate();
    const species = useParams();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [ commonFields, setCommonFields] = useState([]);
    const [ selectedPollinators, setSelectedPollinators] = useState([]);

    const pollinators = [
        { name: "bee", img: "https://i.imgur.com/w3tMt7W.png" },
        { name: "beetle", img: "https://i.imgur.com/aKwX9JC.png" },
        { name: "butterfly", img: "https://i.imgur.com/akY6Oub.png" },
        { name: "fly", img: "https://i.imgur.com/DZ6EZWb.png" },
        { name: "hummingbird", img: "https://i.imgur.com/bb4lJRR.png" },
        { name: "moth", img: "https://i.imgur.com/PbKZej2.png" },
        { name: "wind", img: "https://i.imgur.com/wnlbdS6.png" }
    ];
    const care = [
        { "name": "sun", "img": "https://i.imgur.com/NuMITEz.png" },
        { "name": "shade", "img": "https://i.imgur.com/3jgYzBW.png" },
        { "name": "wet", "img": "https://i.imgur.com/4PytYk5.png" },
        { "name": "dry", "img": "https://i.imgur.com/mtghmUx.png" }
    ];

    // Get species info & set
    useEffect(() => {
      speciesService.getSpeciesById(species.id, (isSuccessful, response) => {
        updateMessage({});
        if (isSuccessful) {
                // Populate form fields with species data
                setValue('scientific_name', response.scientific_name);
                setValue('type', response.type);
                setSelectedPollinators(response.pollinators);
                setValue('care.sun', response.care.sun);
                setValue('care.moisture', response.care.moisture);
                setValue('img', response.img);
            
                if (response.common_names && response.common_names.length > 0) {
                    setCommonFields(response.common_names);
                } else {
                    setCommonFields(['']);
                }
        } else {
            updateMessage({content: 'Unable to retrieve species from server.', type: 'danger'})
        }
      });
    }, []);

    // Update common_name fields
    const handleFormChange = (index, event) => {
        let data = [...commonFields];
        data[index] = event.target.value;
        setCommonFields(data);
    };

  // Add/remove fields
  const addField = (e) => {
    e.preventDefault();
    if (commonFields.length <= 4){
      setCommonFields([...commonFields, '']);
    } else {
      errors.common_names.message = "Maximum number of fields reached."
    }
};
    const removeField = (index, e) => {
        let data = [...commonFields];
        data.splice(index, 1);
        setCommonFields(data);
    };

    // Handle Pollinators
    const handlePollinatorChange = (event, pollinatorName) => {
        if (event.target.checked) {
          setSelectedPollinators((prevSelected) => [...prevSelected, pollinatorName]);
        } else {
          setSelectedPollinators((prevSelected) =>
            prevSelected.filter((name) => name !== pollinatorName)
          );
        }
      };

      const updateData = (data) => {
        data.pollinators = selectedPollinators;
        data.common_names = commonFields;
        data.id = species.id;
        
        if (authService.isSignedIn()) {
          speciesService.updateSpecies(data, (isSuccessful, response) => {
            if (isSuccessful) {
              navigate('/');
              updateMessage({ content: response, type: 'success' });
            } else {
              updateMessage({ content: response, type: 'danger' });
            }
          });
        } else {
          navigate('/signin')
          updateMessage({content: 'You must be signed in to manage species data.', type: 'warning'});
        }
      };

      return (
        <form onSubmit={handleSubmit(updateData)} className="form-create">
          <h1 className="h3 mb-3 font-weight-normal text-center">Edit Species</h1>
    
              {/*Scientific Name*/}
              <label htmlFor="scientificName mt-3" className="form-label">Scientific Name</label>
              <input {...register('scientific_name', { required: "Scientific name is required."})} id="scientificName" className="form-control" />
              {errors.scientific_name && <p className="text text-center text-danger small">{errors.scientific_name.message}</p>}
    
          {/*Common Names*/}
          <label htmlFor="commonNames" className='form-label mt-4'>Common Names</label>
          <div className='form-group'>
          {commonFields.map((input, index) => {
            return (
              <div key={index} className='d-flex'>
                <input               
                  id={`common${index+1}`}
                  className='form-control mt-1'
                  value={input}
                  onChange={event => handleFormChange(index, event)}
                />
              <button onClick={() => removeField(index)} className='btn btn-secondary m-1'>-</button>
              </div>
            )
          })}
          <button onClick={addField} className='btn btn-secondary m-1 float-right'>+ Add Name</button>
          </div>   
    
             {/*Type*/}
              <label htmlFor="type" className='form-label mt-4'>Type</label>
              <select {...register('type', { required: "Please select a type." })} id="type" placeholder='select' className="form-control">
                    <option value="climber">Climber</option>
                    <option value="creeper">Creeper</option>
                    <option value="herb">Herb</option>
                    <option value="shrub">Shrub</option>
                    <option value="tree">Tree</option>
                </select>
                {errors.type && <p className="text text-center text-danger small">{errors.type.message}</p>}
    
          {/* Pollinators */}
          <label htmlFor="pollinators" className="form-label mt-4">
            Select Pollinators:
          </label>
          <div className="d-flex justify-content-around">
            {pollinators.map((pollinator, index) => (
              <div key={index}>
                <label htmlFor={`pollinator_${pollinator.name}`}>
                  <input
                    {...register(`pollinators`, 'Please select at least one pollinator.')}
                    type="checkbox"
                    value={pollinator.name}
                    id={`pollinator_${pollinator.name}`}
                    onChange={(e) => handlePollinatorChange(e, pollinator.name)}
                    checked={selectedPollinators.includes(pollinator.name)}
                  />
                  <img
                    src={pollinator.img}
                    alt={pollinator.name}
                    style={{
                      opacity: selectedPollinators.includes(pollinator.name) ? 1 : 0.3,
                      transition: 'opacity 0.3s ease-in-out',
                      cursor: 'pointer',
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
          {errors.pollinators && <p className="text text-center text-danger small">{errors.pollinators.message}</p>}
    
    
            {/* Plant Care - Sun */}
            <label htmlFor="sun" className="form-label mt-4">Sun</label>
            <div className="form-group d-flex">
              <img src={care[1].img} className="m-3"/>
                <input {...register('care.sun', {required: 'Please select required sun.'})} type="range" className="form-range flex-fill" id="sun" min="0" max="4"/>
              <img src={care[0].img} className="m-3"/>
            </div>
    
            {errors.sun && <p className="text text-center text-danger small">{errors.sun.message}</p>}
    
            {/* Plant Care - Moisture */}
            <label htmlFor="Moisture" className="form-label mt-4">Moisture</label>
            <div className="form-group d-flex">
            <img src={care[3].img} className="m-3"/>
                <input {...register('care.moisture', {required: 'Please select required moisture'})} type="range" className="form-range flex-fill" id="moisture" min="0" max="4"/>
            <img src={care[2].img} className="m-3" />
            </div>
            {errors.moisture && <p className="text text-center text-danger small">{errors.moisture.message}</p>}
                    
            {/* Img */}
            <label htmlFor="image" className="form-label mt-4">Image URL</label>
            <div className="form-group d-flex">
            <input {...register('img', { required: "Image URL is required."})} id="img" className="form-control" />
            </div>
            {errors.img && <p className="text text-center text-danger small">{errors.img.message}</p>}
    
    
            {/*Submit*/}
            <div className="text-center">
                <button type="submit" className="btn btn-primary m-4">Submit</button>
                <Link to="/" className="btn btn-warning m-4">Cancel</Link>
            </div>
          </form>
    
      )
    };

export default EditForm;