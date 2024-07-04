"use client";
import React from "react";
import { useState } from "react";

import { Button } from "../../src/Button";
import { Modal } from "../../src/Modal";
import { Dialog } from "../../src/Dialog";
import { Heading } from "react-aria-components";
import TorusInput from "../TorusComponents/TorusInput";
import { EditIcon } from "../components/icons";
const URL = "http://192.168.2.94:3010/vmsp_banks/";

const Vmsp_banksEditModal = ({
  id,
  setRefetch,
  update,
}: {
  id: any;
  setRefetch: any;
  update: any;
}) => {
  const [isOpen, onOpenChange] = useState(false);
  const [formvalue, setFormVal] = useState({});
  // const [test, setTest] = useState("hari");
  const [fetchUser, setFetchUser] = useState(update);

  async function post() {
    console.log(id);
    console.log(fetchUser);

    const url = URL + id;
    console.log(url, "URL");

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchUser),
    });
    console.log(res);
    if (res) {
      onOpenChange(false);
      setRefetch((prev: boolean) => !prev);
    }
  }
  return (
    <>
      <span onClick={() => onOpenChange(true)}>
        <EditIcon />
      </span>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange} /*placement='top-center'*/
      >
        <Dialog>
          {(onClose) => (
            <>
              <Heading className="flex flex-col gap-1">Edit items</Heading>
              <div className="flex flex-col gap-6 p-6">
                <TorusInput
                  value={fetchUser.bank_code}
                  autoFocus
                  label="Bank code"
                  name="bank_code"
                  placeholder="Enter your Bank code"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  // handleInputChange={(e: any) => {
                  //   handleChange(e);
                  // }}
                  onChange={setFetchUser}
                />
                <TorusInput
                  value={fetchUser.short_code}
                  label="Short code"
                  name="short_code"
                  placeholder="Enter your Short code"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  onChange={setFetchUser}
                />
                <TorusInput
                  value={fetchUser.bank_type}
                  label="Bank type"
                  name="bank_type"
                  placeholder="Enter your Bank type"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  onChange={setFetchUser}
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
                  onPress={() => post()}
                >
                  Edit
                </Button>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </>
  );
};

export default Vmsp_banksEditModal;
