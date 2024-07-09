"use client";
import React from "react";
import { useState } from "react";

import { Button } from "../../src/Button";
import { Modal } from "../../src/Modal";
import { Dialog } from "../../src/Dialog";
import {
  Heading,
  OverlayArrow,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";
import TorusInput from "../TorusComponents/TorusInput";
import { EditIcon } from "../components/icons";
const URL = "http://192.168.2.94:3010/vmsp_banks/";

const EditModal = ({
  id,
  setRefetch,
  update,
}: {
  id: any;
  setRefetch: any;
  update: any;
}) => {
  const [isOpen, onOpenChange] = useState(false);
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
      <TooltipTrigger>
        <Button
          onPress={() => onOpenChange(true)}
          className={
            " p-2 text-sm font-medium text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          }
        >
          <EditIcon />
        </Button>
        <Tooltip
          className={
            " p-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-sm transition-opacity"
          }
        >
          <OverlayArrow>
            <svg width={8} height={8}></svg>
          </OverlayArrow>
          Edit
        </Tooltip>
      </TooltipTrigger>
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
                  type="text"
                  onChange={setFetchUser}
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
                  value={fetchUser.short_code}
                  label="Short code"
                  name="short_code"
                  placeholder="Enter your Short code"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  onChange={setFetchUser}
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
                  value={fetchUser.bank_type}
                  label="Bank type"
                  name="bank_type"
                  placeholder="Enter your Bank type"
                  //   variant='bordered'
                  //   isRequired={true}
                  type="text"
                  onChange={setFetchUser}
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
                  className={"bg-red-500 hover:bg-red-800"}
                  type="reset"
                  // variant='flat'
                  onPress={() => onOpenChange(false)}
                >
                  Close
                </Button>
                <Button
                  className={"bg-green-500 hover:bg-green-800"}
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

export default EditModal;
