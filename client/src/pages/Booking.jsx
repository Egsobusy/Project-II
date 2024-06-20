import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

export default function Booking() {
  const {currentUser, loading, error} = useSelector((state) => state.user);
  const [showBookingsError, setShowBookingsError] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  console.log(userBookings);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setShowBookingsError(false);
        const res = await fetch(`/api/user/bookings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowBookingsError(true);
          return;
        }
        setUserBookings(data);
      } catch (error) {
        setShowBookingsError(true);
      }
    };
    fetchBookings();
  }, []);
  
  const handleBookingDelete = async (bookingId) => {
    try {
      const res = await fetch(`/api/booking/delete/${bookingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
          Your Bookings
      </h1>

      {userBookings && userBookings.length > 0 && (
        <div className='flex flex-col gap-4'>
          {userBookings.map((booking) => (
            <div
              key={booking._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/booking/${booking._id}`}>
                <img
                  src={booking.imageUrls[0]}
                  alt='booking cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/booking/${booking._id}`}
              >
                <p>{booking.placeName}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleBookingDelete(booking._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-booking/${booking._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
          </div>
      )}
    </div>
  )
}
