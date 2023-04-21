import axios from '#/api/axios';

export default function Home() {
  function handleClick() {
    axios
      .post('/admin/court', {
        name: 'Basketball',
        bookingType: 'single',
        capacity: 1,
        count: 2
      })
      .then((res) => console.log(res))
      .catch((error) => console.log(error));
  }
  return (
    <button type='button' onClick={handleClick}>
      Click
    </button>
  );
}
