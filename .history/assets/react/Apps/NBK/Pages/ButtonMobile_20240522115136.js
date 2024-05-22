import React, { useEffect, useState } from 'react';


const ButtonModile = ({buttonName}) => {

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
      const handleFocus = () => {
        console.log("Keyboard is open");
        setKeyboardVisible(true);
      };
  
      const handleBlur = () => {
        console.log("Keyboard is closed");
        setKeyboardVisible(false);
      };
  
      // Add event listeners to all input elements
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
      });
  
      // Cleanup event listeners on component unmount
      return () => {
        inputs.forEach(input => {
          input.removeEventListener('focus', handleFocus);
          input.removeEventListener('blur', handleBlur);
        });
      };
    }, []);

    return (
<button type="submit" className="btn-proceed" style={{ marginBottom: keyboardVisible ? "25rem" : ""}}>
            Next
          </button>
    )
}

export default ButtonModile;
