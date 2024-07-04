import React from "react";
import { Heading } from "react-aria-components";
import { useState } from "react";
// import { Button, Dialog, TorusInput, Modal } from "react-aria-components";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../../src/Button";
import { Modal } from "../../src/Modal";
import { Dialog } from "../../src/Dialog";
import TorusInput from "../TorusComponents/TorusInput";

const Vmsp_banksCreateModal = ({ setRefetch }: { setRefetch: any }) => {
  const [isOpen, onOpenChange] = useState(false);
  const [formvalue, setFormVal] = useState({});

  async function post(e: any) {
    // e.preventDefault();

    const res = await fetch("http://192.168.2.94:3010/vmsp_banks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formvalue),
    });
    if (res) {
      onOpenChange(false);
      setRefetch((prev: boolean) => !prev);
    }
  }

  const handleChange = (e: any) => {
    if (e.target.type == "number") {
      setFormVal((prev) => ({
        ...prev,
        [e.target.name]: Number(e.target.value),
      }));
    } else {
      setFormVal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };
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
                  label="Bank code"
                  name="bank_code"
                  placeholder="Enter your Bank code"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="string"
                  onChange={(e: any) => {
                    handleChange(e);
                  }}
                />
                <TorusInput
                  autoFocus
                  label="Short code"
                  name="short_code"
                  placeholder="Enter your Short code"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="string"
                  onChange={(e: any) => {
                    handleChange(e);
                  }}
                />
                <TorusInput
                  autoFocus
                  label="Bank type"
                  name="bank_type"
                  placeholder="Enter your Bank type"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="string"
                  onChange={(e: any) => {
                    handleChange(e);
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="reset"
                  // variant='flat'
                  onPress={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  //   color='primary'
                  //   onPress={() => onClose}
                  onPress={post}
                >
                  Post
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
