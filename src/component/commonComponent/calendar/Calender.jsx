import { Calendar } from 'primereact/calendar';
import './Calendar.css'

const ViewCalendar = () => {
  const currentDate = new Date();

  return (
    <div className="w-full">
      <Calendar 
        value={currentDate} 
        inline 
        showOtherMonths
        style={{ 
          width: '300px', // Adjust width
          height: '250px', // Set height
          fontSize: '14px', // Scale down text
          overflow: 'hidden' // Prevent scrolling
        }}
        datepickerStyle={{
          height: '100%', // Fit within container
          padding: '0.25rem' // Reduced padding
        }}
      />
    </div>
  );
};

export default ViewCalendar;