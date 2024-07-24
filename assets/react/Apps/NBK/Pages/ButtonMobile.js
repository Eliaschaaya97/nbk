import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ButtonMobile = ({ buttonName, setNext }) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const parameters = useSelector((state) => state.appData.parameters);

  useEffect(() => {
    if (parameters?.deviceType === "Android") {
      const handleFocus = () => {
        // console.log("Keyboard is open");
        setKeyboardVisible(true);
      };

      const handleBlur = () => {
        // console.log("Keyboard is closed");
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
    }
  }, [parameters]);

  const submittingForm = () => {
    if (setNext) {
      setNext(true);
    }
  };

  return (
    <button
      type="submit"
      className="btn-proceed"
      style={{ marginBottom: keyboardVisible ? "26rem" : "" }}
      onClick={submittingForm}
    >
      {buttonName}
    </button>
  );
};

export default ButtonMobile;