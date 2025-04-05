const EthiopianFlag = () => {
  return (
    <svg 
      width="24" 
      height="16" 
      viewBox="0 0 30 20" 
      className="inline-block mr-2"
    >
      {/* Green stripe */}
      <rect width="30" height="6.66" fill="#078930" />
      
      {/* Yellow stripe */}
      <rect y="6.66" width="30" height="6.66" fill="#FCDD09" />
      
      {/* Red stripe */}
      <rect y="13.33" width="30" height="6.66" fill="#DA121A" />
      
      {/* Blue circle with star */}
      <circle cx="15" cy="10" r="4.5" fill="#0F47AF" />
      
      {/* Yellow star */}
      <path
        d="M15 6.5l.95 2.9h3.05l-2.47 1.8.94 2.9L15 12.3l-2.47 1.8.94-2.9-2.47-1.8h3.05z"
        fill="#FCDD09"
      />
    </svg>
  );
};

export default EthiopianFlag;