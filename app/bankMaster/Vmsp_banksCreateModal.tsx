import React from "react";
import { Heading } from "react-aria-components";
import { useState } from "react";
// import { Button, Dialog, TorusInput, Modal } from "react-aria-components";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../../src/Button";
import { Modal } from "../../src/Modal";
import { Dialog } from "../../src/Dialog";
import TorusInput from "../TorusComponents/TorusInput";
interface Vmsp_banks {
  bank_code: string;
  short_code: string;
  bank_type: string;
}
const Vmsp_banksCreateModal = ({ setRefetch }: { setRefetch: any }) => {
  const [isOpen, onOpenChange] = useState(false);
  const [formvalue, setFormVal] = useState<Vmsp_banks>({
    bank_code: "",
    short_code: "",
    bank_type: "",
  });

  async function post(e: any) {
    const res = await fetch("http://192.168.2.94:3010/vmsp_banks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formvalue),
    });
    if (res) {
      setFormVal({
        bank_code: "",
        short_code: "",
        bank_type: "",
      });
      onOpenChange(false);
      setRefetch((prev: boolean) => !prev);
    }
  }

  return (
    <>
      <Button
        onPress={() => onOpenChange(true)}
        className="flex h-14 gap-1 bg-primary-500"
      >
        <IoMdAddCircle size={20} />
        <span className="font-bold">Add New</span>
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange} /*placement='top-center'*/
      >
        <Dialog>
          {(onClose) => (
            <>
              <Heading className="flex flex-col gap-1">Add New Items</Heading>
              <div className="flex flex-col gap-6 p-6">
                <TorusInput
                  autoFocus
                  value={formvalue.bank_code}
                  label="Bank code"
                  name="bank_code"
                  placeholder="Enter your Bank code"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  onChange={setFormVal}
                />
                <TorusInput
                  value={formvalue.short_code}
                  label="Short code"
                  name="short_code"
                  placeholder="Enter your Short code"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  onChange={setFormVal}
                />
                <TorusInput
                  value={formvalue.bank_type}
                  label="Bank type"
                  name="bank_type"
                  placeholder="Enter your Bank type"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  onChange={setFormVal}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="reset"
                  // variant='flat'
                  onPress={() => {
                    onOpenChange(false);
                    setFormVal({
                      bank_code: "",
                      short_code: "",
                      bank_type: "",
                    });
                  }}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  //   color='primary'
                  //   onPress={() => onClose}
                  onPress={post}
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </>
  );
};

export default Vmsp_banksCreateModal;
