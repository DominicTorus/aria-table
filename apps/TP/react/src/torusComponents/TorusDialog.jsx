import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import { merger } from '../utils/utils';

export default function TorusDialog({
  triggerElement,
  children,
  classNames,
  isDismissable = true,
  dialogbackground
}) {
  return (
    <DialogTrigger>
      {triggerElement}

      <ModalOverlay
        isDismissable={isDismissable}
        className={merger(
          'fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center bg-transparent',
          classNames?.modalOverlayClassName,
        )}
      >
        <Modal
          isDismissable={isDismissable}
          className={merger(
            'tours-selected:border-transparent  border-transparent outline-transparent  torus-focus:border-none torus-focus:outline-1 torus-focus:ring-0 torus-selected:outline-none',
            classNames?.modalClassName,
          )}
        >
          <Dialog
            className={merger(
              'focus:border-none focus:outline-none focus:ring-0',
              classNames?.dialogClassName,
            )}
            style={{
              backgroundColor:dialogbackground ? dialogbackground : ""
            }}
          >
            {({ close }) => (
              <>
                {typeof children === 'function'
                  ? children({ close })
                  : children}
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
