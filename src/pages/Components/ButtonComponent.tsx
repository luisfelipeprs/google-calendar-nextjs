import React from 'react';

type ButtonComponentProps = {
  onClick: () => void;
  text: string;
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({ onClick, text }) => {
  return (
    <button
      className="w-full bg-[#FEED24] text-[#060F33] border-[2px] border-[#060F33] font-poppins py-3 text-center rounded-sm"
      onClick={onClick}
    >
      <p className='w-40 text-center mx-auto'>
        {text}
      </p>
    </button>
  );
};

export default ButtonComponent;
