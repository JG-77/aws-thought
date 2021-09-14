//import React, { useRef } from 'react';
import React, { useState, useRef } from 'react';
//useRef Hook to retrieve the image file uploaded by the user, by accessing the <input type="file"> element

const ThoughtForm = () => {
  const [formState, setFormState] = useState({
    username: '',
    thought: '',
  });
  const [characterCount, setCharacterCount] = useState(0);

  // set the initial value of fileInput—the reference to the DOM element, <input type="file">—to null. This ensures that the reference to the DOM element is current
  const fileInput = useRef(null);

  const handleImageUpload = (event) => {
    event.preventDefault();
    //declare an interface object from FormData, called data
    const data = new FormData();
    //FormData makes it easy to construct a set of key-value pairs, mirroring the format of a form with the type set to "multipart/form-data"
    //assign a key-value pair to the FormData object with the name of the image file (image) and the payload (the image file)
    //assign the reference to the image file with fileInput.current.files[0]
    data.append('image', fileInput.current.files[0]);

    // send image file to endpoint with the postImage function
    const postImage = async () => {
      try {
        const res = await fetch('/api/image-upload', {
          mode: 'cors',
          method: 'POST',
          //used a POST method to send the image file as data in the body of the fetch request
          body: data,
        });
        if (!res.ok) throw new Error(res.statusText);
        //convert the response into a JSON object, so that we can add this new key-value to formState
        const postResponse = await res.json();
        //new key-value pair is { image: postResponse.Location }, which is the public URL of the image
        setFormState({ ...formState, image: postResponse.Location });
        console.log('postImage: ', postResponse.Location);

        return postResponse.Location;
      } catch (error) {
        console.log(error);
      }
    };
    postImage();
  };

  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value });
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const postData = async () => {
      //fetch function to send the form data to the endpoint in the body of the request
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      console.log(data);
    };
    postData();

    // clear form value
    setFormState({ username: '', thought: '' });
    setCharacterCount(0);
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <input
          placeholder="Name"
          name="username"
          value={formState.username}
          className="form-input col-12 "
          onChange={handleChange}
        ></input>
        <textarea
          placeholder="Here's a new thought..."
          name="thought"
          value={formState.thought}
          className="form-input col-12 "
          onChange={handleChange}
        ></textarea>

        <label className="form-input col-12  p-1">
          Add an image to your thought:
          {/* <input> type is file --> With this designation, HTML can browse and add files from your computer */}
          {/* ref attribute is assigned to the fileInput. We'll define this function using a React Hook name, useRef */}
          <input type="file" ref={fileInput} className="form-input p-2" />
          {/* handleImageUpload function will send the image to the image upload endpoint we created */}
          <button className="btn" onClick={handleImageUpload} type="submit">
            Upload
          </button>
        </label>

        <button className="btn col-12 " type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
