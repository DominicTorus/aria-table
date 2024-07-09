import React from "react";
import { Heading } from "react-aria-components";
import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { Button } from "../../src/Button";
import { Modal } from "../../src/Modal";
import { Dialog } from "../../src/Dialog";
import TorusInput from "../TorusComponents/TorusInput";
import { tableData } from "./columns";


const CreateModal = ({ setRefetch }: { setRefetch: any }) => {
  const [isOpen, onOpenChange] = useState(false);
  const [formvalue, setFormVal] = useState<tableData>({
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
        className="flex h-10 w-[150px] gap-3 bg-primary-500"
      >
        <IoMdAddCircle size={20} />
        <p className="font-bold">Add New</p>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                  type="text"
                  onChange={setFormVal}
                  variant="fade"
                  isDisabled={false}
                  width="full"
                  height="xl"
                  radius="lg"
                  textColor="text-black"
                  bgColor="bg-gray-100"
                  hoverColor="torus-hover:bg-fuchsia-500/50"
                />
                <TorusInput
                  value={formvalue.short_code}
                  label="Short code"
                  name="short_code"
                  placeholder="Enter your Short code"
                  type="text"
                  onChange={setFormVal}
                  variant="fade"
                  isDisabled={false}
                  width="full"
                  height="xl"
                  radius="lg"
                  textColor="text-black"
                  bgColor="bg-gray-100"
                  hoverColor="torus-hover:bg-fuchsia-500/50"
                />
                <TorusInput
                  value={formvalue.bank_type}
                  label="Bank type"
                  name="bank_type"
                  placeholder="Enter your Bank type"
                  type="text"
                  onChange={setFormVal}
                  variant="fade"
                  isDisabled={false}
                  width="full"
                  height="xl"
                  radius="lg"
                  textColor="text-black"
                  bgColor="bg-gray-100"
                  hoverColor="torus-hover:bg-fuchsia-500/50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className={"bg-red-500"}
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
                <Button className={"bg-green-500"} type="submit" onPress={post}>
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

export default CreateModal;
