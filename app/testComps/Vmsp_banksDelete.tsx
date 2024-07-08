"use client";

import React, { useState } from "react";
import { DialogTrigger, Heading } from "react-aria-components";
import { Dialog } from "../../src/Dialog";
import { Button } from "../../src/Button";
import { Modal } from "../../src/Modal";

import { DeleteIcon } from "../components/icons";
const Vmsp_banksDeleteModal = ({
  id,
  setRefetch,
}: {
  id?: any;
  setRefetch?: any;
}) => {
  const [onOpen, onOpenChange] = useState(false);
  async function post(e: any) {
    let url = "http://192.168.2.94:3010/vmsp_banks/" + id;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res) {
      setRefetch((prev: boolean) => !prev);
    }
  }

  return (
    <>
      <DialogTrigger>
        <Button className={"bg-red-500"} onPress={() => onOpenChange(true)}>
          <DeleteIcon />
        </Button>
        <Modal isOpen={onOpen} onOpenChange={onOpenChange}>
          <Dialog>
            {(onClose) => (
              <div className="flex flex-col gap-6 p-2">
                <p className="text-bold">
                  Are you sure you want to delete this record?
                </p>

                <div className="flex gap-2 justify-end">
                  <Button className={"bg-green-500"} onPress={post}>
                    Yes
                  </Button>

                  <Button
                    className={"bg-red-500"}
                    onPress={() => onOpenChange(false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </>
  );
};

export default Vmsp_banksDeleteModal;
