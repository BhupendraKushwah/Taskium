
export const getImage = (folder, image) => {
  try {
    if (!image) return;
    let cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/taskium/${folder}/${image}`
  } catch (error) {
    throw error;
  }
}
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID(); // or any UUID lib
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

export function getCustomTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  switch (true) {
    case (seconds < 60):
      return 'Just now';
    case (minutes < 60):
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    case (hours < 24):
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    case (days < 30):
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    case (months < 12):
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    default:
      return `${years} year${years !== 1 ? 's' : ''} ago`;
  }
}
