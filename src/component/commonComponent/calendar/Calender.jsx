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

      />
    </div>
  );
};

export default ViewCalendar;
