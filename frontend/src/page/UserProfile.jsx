import { Modal } from 'antd';
import { Button, Input, CustomMultiSelectField, Datepicker } from '../component/commonComponent/customFields';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { NavLink, useParams } from 'react-router'; // Fixed import typo
import useApi from '../hooks/instance';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { getImage } from '../component/commonComponent/common';
import { useUser } from "../context/userContext/UserContext";
import PreviewModal from '../component/commonComponent/common/PreviewModal';

const UserProfile = () => {
  const [modalType, setModalType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [previewModel, setPreviewModel] = useState({
    isOpen: false,
    file: null
  });
  const { id } = useParams(); // Destructure for cleaner access
  const { user, fetchUser } = useUser();

  // Fetch user data when ID changes
  useEffect(() => {
    if (id) {
      fetchUser(); // Runs asynchronously
    }
  }, [id]);

  // Sync local state with context user
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  if (!userData) {
    return <div className="min-h-screen p-4 sm:p-6">Loading...</div>;
  }

  const handlePreview = (img) => {
    if (!img) return;
    let mimetype = `image/${img.split('.')[1]}`;
    const fileData = {
      src: getImage('profile/large', img),
      mimetype: mimetype
    }
    setPreviewModel({
      isOpen: true,
      file: fileData
    });
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col justify-between rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:flex-row sm:items-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h3>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        {/* Profile Summary */}
        <div className="col-span-1 relative rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:col-span-2 md:col-span-5">
          <div className="absolute top-1 right-3 px-2">
            <button
              className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setModalType('professional')}
            >
              <i className="ph ph-pencil-simple-line text-teal-600 dark:text-teal-400"></i>
            </button>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row items-start md:justify-between">
            <div className="flex sm:w-1/2 w-full items-center gap-4">
              <div className="w-20 flex-shrink-0 cursor-pointer" onClick={() => handlePreview(userData?.image)}>
                <img
                  src={getImage('profile/medium', userData?.image) || 'https://dummyimage.com/64x82/000/fff'}
                  alt="User"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <div className="space-y-1">
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white">{userData?.name || 'N/A'}</h5>
                <p className="text-sm text-gray-600 dark:text-gray-300">{userData?.designation || 'No Data'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {userData?.startDate ? dayjs(userData.startDate).format('YYYY-MM-DD') : 'No Data'} -
                  {userData?.endDate ? dayjs(userData.endDate).format('YYYY-MM-DD') : userData?.startDate ? 'Till Now' : 'No Data'}
                </p>
                <NavLink to="/settings" className="flex items-center gap-1 text-sm text-blue-500 hover:underline">
                  <i className="ph ph-fingerprint"></i> Reset Password
                </NavLink>
              </div>
            </div>
            <div className="grid sm:w-1/2 w-full grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <div className="flex items-center gap-2 truncate">
                <i className="ph ph-envelope-simple text-teal-600 dark:text-teal-400"></i>
                {userData?.registeredEmail || 'No Data'}
              </div>
              <div className="flex items-center gap-2">
                <i className="ph ph-phone text-teal-600 dark:text-teal-400"></i>
                {userData?.phone || 'No Data'}
              </div>
              <div className="flex items-center gap-2">
                <i className="ph ph-code text-teal-600 dark:text-teal-400"></i>
                {userData?.code || 'OX578SO'}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:col-span-1 md:col-span-2 md:row-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h5>
            <button
              className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setModalType('personal')}
            >
              <i className="ph ph-pencil-simple-line text-teal-600 dark:text-teal-400"></i>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="min-w-[45%]">
              <p className="font-medium">Gender</p>
              <span className="text-gray-400">{userData?.gender || 'No Data'}</span>
            </div>
            <div className="min-w-[45%]">
              <p className="font-medium">Date of Birth</p>
              <span className="text-gray-400">{userData?.dob ? dayjs(userData.dob).format('YYYY-MM-DD') : 'No Data'}</span>
            </div>
            <div className="min-w-[45%]">
              <p className="font-medium">Registered Email</p>
              <span className="text-gray-400">{userData?.email || 'No Data'}</span>
            </div>
            <div className="min-w-[45%]">
              <p className="font-medium">Permanent Address</p>
              <span className="text-gray-400">{userData?.address || 'No Data'}</span>
            </div>
            <div className="min-w-[45%]">
              <p className="font-medium">Residential Address</p>
              <span className="text-gray-400">{userData?.residence || 'No Data'}</span>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:col-span-1 md:col-span-3 md:row-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h5>
            <button className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
              <i className="ph ph-pencil-simple-line text-teal-600 dark:text-teal-400"></i>
            </button>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">Placeholder for additional details.</p>
          </div>
        </div>

        {/* Social Networks */}
        <div className="col-span-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:col-span-2 md:col-span-5">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-600">
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">Social Networks</h5>
            <button
              className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setModalType('social')}
            >
              <i className="ph ph-plus-circle text-teal-600 dark:text-teal-400"></i>
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {[
              { src: '/images/social/facebook.png', label: 'Facebook', url: userData?.facebook || '#' },
              { src: '/images/social/linkedin.png', label: 'LinkedIn', url: userData?.linkedin || '#' },
              { src: '/images/social/x.png', label: 'X', url: userData?.x || '#' },
              { src: '/images/social/instagram.png', label: 'Instagram', url: userData?.instagram || '#' },
            ].map((social, index) => (
              <div key={index} className="flex items-center gap-2">
                <img src={social.src} alt={social.label} className="h-6 w-6 rounded-full object-cover" />
                <a href={social.url} className="text-sm font-semibold text-teal-600 hover:underline">
                  Connect
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PersonalInfoForm
        isOpen={modalType === 'personal'}
        onClose={() => setModalType(null)}
        userData={userData}
        updateUserData={setUserData}
      />
      <SocialMediaForm
        isOpen={modalType === 'social'}
        onClose={() => setModalType(null)}
        userData={userData}
        updateUserData={setUserData}
      />
      <ProfessionalForm
        isOpen={modalType === 'professional'}
        onClose={() => setModalType(null)}
        userData={userData}
        updateUserData={setUserData}
      />
      <PreviewModal
        mimetype={previewModel.file?.mimetype}
        src={previewModel.file?.src}
        isOpen={previewModel.isOpen}
        onClose={() => setPreviewModel({ isOpen: false })}
      />


    </div>
  );
};

// Personal Info Form
export const PersonalInfoForm = ({ isOpen, onClose, userData, updateUserData }) => {
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      gender: userData?.gender || '',
      dob: userData?.dob ? dayjs(userData.dob) : null,
      address: userData?.address || '',
      residence: userData?.residence || '',
      sameAsPermanentAddress: userData?.residence === userData?.address,
    },
  });
  const api = useApi();
  const { fetchUser } = useUser();
  const [sameAsPermanent, setSameAsPermanent] = useState(userData?.residence === userData?.address);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [image, setImage] = useState(null);
  const permanentAddress = watch('address');

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('id', userData.id);
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('gender', data.gender?.value || data.gender);
      formData.append('dob', data.dob ? dayjs(data.dob).format('YYYY-MM-DD') : '');
      formData.append('address', data.address);
      formData.append('residence', data.residence);

      if (image instanceof File) {
        formData.append('image', image);
      } else if (userData.image) {
        formData.append('profileImage', userData.image);
      }

      const response = await api.put(`/users/profile/${userData.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.success) {
        await fetchUser();
        updateUserData({ ...userData, ...data, image: response.data?.image || userData.image });
        toast.success('Personal information updated');
        onClose();
      } else {
        toast.error('Failed to update personal information');
      }
    } catch (error) {
      console.error('Error updating personal info:', error);
      toast.error('Error updating personal information');
    }
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsPermanent(isChecked);
    setValue('residence', isChecked ? permanentAddress : '', { shouldValidate: true });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file && !validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please select a JPEG, PNG, or JPG image.');
      return;
    }
    setImage(file);
    setUserImagePreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <Modal
      title={<span className="text-gray-700 dark:text-gray-200">Edit Personal Information</span>}
      centered
      open={isOpen}
      onOk={handleSubmit(onSubmit)}
      onCancel={onClose}
      footer={[
        <Button key="cancel" className="px-4 py-2 rounded bg-white text-gray-500 border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" className="px-4 py-2 ml-2 rounded bg-teal-500 text-white hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="relative group">
            <img
              src={userImagePreview || getImage('profile/large', userData?.image) || 'https://dummyimage.com/64x82/000/fff'}
              alt="User"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-gray-300 dark:ring-gray-600"
            />
            <label
              htmlFor="profileImage"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition"
            >
              <span className="text-xs font-medium">Change</span>
            </label>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Upload a profile picture</p>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          {[
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email', rules: { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email!' } } },
            { name: 'phone', label: 'Phone', type: 'text' },
          ].map(({ name, label, type, rules = {} }) => (
            <div key={name} className="w-[45%]">
              <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">{label}</label>
              <Controller
                name={name}
                control={control}
                rules={{ required: `${label} is required!`, ...rules }}
                render={({ field }) => (
                  <Input {...field} type={type} placeholder={`Enter your ${label}`} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                )}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
            </div>
          ))}

          <div className="w-[45%]">
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Gender</label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Gender is required!' }}
              render={({ field }) => (
                <CustomMultiSelectField
                  {...field}
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                  ]}
                  value={field.value ? { label: field.value, value: field.value } : null}
                  onChange={(option) => field.onChange(option?.value || '')}
                  isMulti={false}
                />
              )}
            />
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
          </div>

          <div className="w-[45%]">
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Date of Birth</label>
            <Controller
              name="dob"
              control={control}
              rules={{ required: 'Date of Birth is required!' }}
              render={({ field }) => (
                <Datepicker
                  defaultValue={field.value}
                  onDateChange={(dateString) => field.onChange(dateString || null)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              )}
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob.message}</p>}
          </div>

          {[
            { name: 'address', label: 'Permanent Address' },
            { name: 'residence', label: 'Residential Address' },
          ].map(({ name, label }) => (
            <div key={name} className="w-[45%]">
              <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">{label}</label>
              <Controller
                name={name}
                control={control}
                rules={{ required: `${label} is required!` }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={`Enter your ${label}`}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    disabled={name === 'residence' && sameAsPermanent}
                  />
                )}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
            </div>
          ))}

          <div className="w-full flex items-center gap-2">
            <input
              type="checkbox"
              {...register('sameAsPermanentAddress')}
              onChange={handleCheckboxChange}
              checked={sameAsPermanent}
            />
            <label className="text-gray-700 dark:text-gray-200">Same as Permanent Address</label>
          </div>
        </div>
      </form>
    </Modal>
  );
};

// Social Media Form
export const SocialMediaForm = ({ isOpen, onClose, userData, updateUserData }) => {
  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      facebook: userData?.facebook || '',
      instagram: userData?.instagram || '',
      x: userData?.x || '',
      linkedin: userData?.linkedin || '',
    },
  });
  const api = useApi();

  const onSubmit = async (data) => {
    try {
      const response = await api.put(`/users/profile/socialLinks/${userData?.id}`, { ...data, userId: userData.id });
      if (response.success) {
        updateUserData({ ...userData, ...data });
        toast.success('Social media links updated');
        onClose();
      } else {
        toast.error('Failed to update social media links');
      }
    } catch (error) {
      console.error('Error updating social media:', error);
      toast.error('Error updating social media links');
    }
  };

  return (
    <Modal
      title={<span className="text-gray-700 dark:text-gray-200">Edit Social Media Links</span>}
      centered
      open={isOpen}
      onOk={handleSubmit(onSubmit)}
      onCancel={onClose}
      footer={[
        <Button key="cancel" className="px-4 py-2 rounded bg-white text-gray-500 border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" className="px-4 py-2 ml-2 rounded bg-teal-500 text-white hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-wrap justify-between gap-4">
        {[
          { name: 'facebook', label: 'Facebook URL' },
          { name: 'instagram', label: 'Instagram URL' },
          { name: 'x', label: 'X URL' },
          { name: 'linkedin', label: 'LinkedIn URL' },
        ].map(({ name, label }) => (
          <div key={name} className="w-[45%]">
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">{label}</label>
            <Controller
              name={name}
              control={control}
              rules={{
                pattern: {
                  value: /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/,
                  message: 'Enter a valid URL!',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="url"
                  placeholder={`Enter your ${label}`}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              )}
            />
            {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
          </div>
        ))}
      </form>
    </Modal>
  );
};

// Professional Form
export const ProfessionalForm = ({ isOpen, onClose, userData, updateUserData }) => {
  const { handleSubmit, control, register, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      designation: userData?.designation || '',
      company: userData?.company || '',
      startDate: userData?.startDate ? dayjs(userData.startDate) : null,
      endDate: userData?.endDate ? dayjs(userData.endDate) : null,
      email: userData?.registeredEmail || '',
      till_now: userData?.startDate && !userData?.endDate,
    },
  });
  const api = useApi();
  const tillNow = watch('till_now');

  const handleTillNowChange = (checked) => {
    setValue('till_now', checked, { shouldValidate: true });
    setValue('endDate', checked ? null : null, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        userId: userData.id,
        startDate: data.startDate ? dayjs(data.startDate).format('YYYY-MM-DD') : null,
        endDate: tillNow ? null : data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : null,
      };
      const response = await api.put(`/users/profile/updateProfession/${userData.id}`, payload);
      if (response.success) {
        updateUserData({ ...userData, ...payload });
        toast.success('Professional information updated');
        onClose();
      } else {
        toast.error('Failed to update professional information');
      }
    } catch (error) {
      console.error('Error updating professional information:', error);
      toast.error('Error updating professional information');
    }
  };

  return (
    <Modal
      title={<span className="text-gray-700 dark:text-gray-200">Edit Professional Information</span>}
      centered
      open={isOpen}
      onOk={handleSubmit(onSubmit)}
      onCancel={onClose}
      footer={[
        <Button key="cancel" className="px-4 py-2 rounded bg-white text-gray-500 border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-400" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" className="px-4 py-2 ml-2 rounded bg-teal-500 text-white hover:bg-teal-700 dark:bg-emerald-600 dark:hover:bg-emerald-700" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update'}
        </Button>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-wrap justify-between gap-4">
        {[
          { name: 'company', label: 'Company' },
          { name: 'designation', label: 'Designation' },
        ].map(({ name, label }) => (
          <div key={name} className="w-[45%]">
            <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">{label}</label>
            <Controller
              name={name}
              control={control}
              rules={{ required: 'This field is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  placeholder={`Enter your ${label}`}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              )}
            />
            {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
          </div>
        ))}
        <div className="w-[45%]">
          <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Email</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'This field is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email!' },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="Enter your Email"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div className="w-[45%]">
          <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">Start Date</label>
          <Controller
            name="startDate"
            control={control}
            rules={{ required: 'This field is required' }}
            render={({ field }) => (
              <Datepicker
                defaultValue={field.value}
                onDateChange={(dateString) => field.onChange(dateString || null)}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          />
          {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
        </div>
        <div className="w-[45%]">
          <label className="block text-gray-700 font-semibold mb-2 dark:text-gray-200">End Date</label>
          <Controller
            name="endDate"
            control={control}
            rules={{
              validate: (value) => !tillNow && !value ? 'This field is required' : true,
            }}
            render={({ field }) => (
              <Datepicker
                key={`datepicker-${tillNow}`} // Force re-render
                defaultValue={tillNow ? null : field.value}
                onDateChange={(dateString) => field.onChange(dateString || null)}
                disabled={tillNow}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            )}
          />
          {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
        </div>
        <div className="w-[45%] flex items-center">
          <input
            type="checkbox"
            id="till_now"
            {...register('till_now')}
            className="mr-2"
            onChange={(e) => handleTillNowChange(e.target.checked)}
          />
          <label htmlFor="till_now" className="block cursor-pointer text-gray-700 font-semibold dark:text-gray-200">Till Now</label>
        </div>
      </form>
    </Modal>
  );
};

export default UserProfile;