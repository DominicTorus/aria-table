import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';
import 'react-toastify/dist/ReactToastify.css';
import {
  ToastClose,
  ToastError,
  ToastSucess,
  ToastWarning,
} from '../../SVG_Application';
import './toast.css'; // Ensure this path is correct based on your directory structure

const TestingToaster = () => {
  const { notifications, clear, markAllAsRead, markAsRead } =
    useNotificationCenter();

  const [wordLength, setWordLength] = React.useState(0);

  console.log(wordLength, 'wordLength');

  const showToast = () => {
    toast('Hello World', {
      data: {
        title: 'Hello World Again',
        text: 'We are here again with another article',
      },
      hideProgressBar: true,
      position: 'bottom-right',
    });
  };

  const showSuccessToast = () => {
    toast.success('Hello World', {
      data: {
        title: 'Success toast',
        text: 'This is a success message',
      },
    });
  };

  const showErrorToast = () => {
    toast.error('Hello World', {
      data: {
        title: 'Error toast',
        text: 'This is an error message',
      },
    });
  };

  const Data = ({ closeToast, toastProps, setWordLength }) => {
    console.log(toastProps, 'ToatProps');

    const countWords = () => {
      let count = toastProps?.text?.trim().split(/\s+/).filter(Boolean).length;

      setWordLength(count);
    };

    React.useEffect(() => {
      countWords();
    }, []);

    console.log(countWords(), 'countWords');

    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex w-[100%] justify-between">
          <div className="flex w-[50%] items-center justify-start">
            <div className="flex w-[30%] items-center justify-start">
              {toastProps.type === 'success' ? (
                <ToastSucess />
              ) : toastProps.type === 'warning' ? (
                <ToastWarning />
              ) : toastProps.type === 'error' ? (
                <ToastError />
              ) : null}
            </div>
            <div className="flex w-[70%] items-center justify-start">
              <p className="font-roboto font-medium text-white">
                {toastProps.title}
              </p>
            </div>
          </div>
          <div className="flex w-[50%] items-center justify-end">
            <button onClick={closeToast}>
              <ToastClose />
            </button>
          </div>
        </div>
        <div>
          <p className="font-roboto text-white">{toastProps.text}</p>
        </div>
      </div>
    );
  };

  const sucessNotify = () => {
    toast(<Data setWordLength={setWordLength} />, {
      type: 'success',
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      title: 'Toast Title',
      text: 'We are here again with another article',
      closeButton: false,
    });
  };

  const waringNotify = () => {
    toast(<Data setWordLength={setWordLength} />, {
      type: 'warning',
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      title: 'Toast Title',
      text: 'We are here again with another article',
      closeButton: false,
    });
  };

  const infoNotify = () => {
    toast(<Data setWordLength={setWordLength} />, {
      type: 'info',
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      title: 'Toast Title',
      text: `Lorem ipsum dolor sit amet, ius fabulas splendide interesset ei, 
      ut deleniti aliquando abhorreant cum. Id sea eirmod eruditi, usu in elitr reprimique, 
      et simul causae vocibus vix. Et eos dicit labore, nam ne facer iracundia persequeris. 
      Ut mentitum feugiat eum. Et pro copiosae senserit. Quis nullam labitur ea per, 
      nec diam luptatum voluptaria ex.`,
      closeButton: false,
    });
  };

  const errorNotify = () => {
    toast(<Data setWordLength={setWordLength} />, {
      type: 'error',
      position: 'bottom-right',
      autoClose: 50000,
      hideProgressBar: true,
      title: 'Toast Title',
      text: 'We are here again with another article',
      closeButton: false,
      className: `${
        wordLength && wordLength > 200
          ? 'custom-toast-morethan200'
          : wordLength > 10
            ? 'custom-toast-morethan10'
            : wordLength > 50
              ? 'custom-toast-morethan50'
              : 'custom-toast'
      }`,
    });
  };

  return (
    <div>
      <p>{notifications.length}</p>
      <button onClick={showToast}>Default</button>
      <button onClick={showSuccessToast}>Success</button>
      <button onClick={showErrorToast}>Error</button>

      <div className="flex w-[100%] justify-center">
        <div className="flex w-[80%] justify-between gap-2">
          <button onClick={sucessNotify}>Sucess Notify</button>
          <button onClick={infoNotify}>Info Notify</button>
          <button onClick={waringNotify}>Warning Notify</button>
          <button onClick={errorNotify}>Error Notify</button>
        </div>
      </div>

      <p
        className={` ${
          wordLength && wordLength > 200 ? 'custom-toast-morethan200' : ''
        }`}
      >
        paragraph known as the components
      </p>

      <br />
      <br />
      <button onClick={clear}>Clear Notifications</button>
      <button onClick={() => markAllAsRead()}>Mark all as read</button>
      <ul>
        {notifications.map((notification) => (
          <li
            onClick={() => markAsRead(notification.id)}
            key={notification.id}
            style={
              notification.read
                ? { background: 'green', color: 'silver', padding: '0 20px' }
                : {
                    border: '1px solid black',
                    background: 'navy',
                    color: '#fff',
                    marginBottom: 20,
                    cursor: 'pointer',
                    padding: '0 20px',
                  }
            }
          >
            <span>id: {notification.id}</span>
            <p>title: {notification.data.title}</p>
            <p>text: {notification.data.text}</p>
          </li>
        ))}
      </ul>
      <ToastContainer
        newestOnTop
        icon={false}
        pauseOnHover={false}
        className={`${
          wordLength && wordLength > 200
            ? 'min-w-[800px] max-w-[800px]'
            : wordLength > 10
              ? 'min-w-[500px] max-w-[500px]'
              : wordLength > 50
                ? 'min-w-[600px] max-w-[600px]'
                : 'min-w-[330px] max-w-[330px]'
        }`}
        rtl={true}
      />
    </div>
  );
};

export default TestingToaster;
