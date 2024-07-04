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
  id: any;
  setRefetch: any;
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
        <Button onPress={() => onOpenChange(true)}>
          <DeleteIcon />
        </Button>
        <Modal isOpen={onOpen} onOpenChange={onOpenChange}>
          <Dialog>
            {(onClose) => (
              <>
                <Heading className="flex flex-col gap-1" slot="title">
                  Confirmation
                </Heading>
                <>
                  <p> Are you sure you want to delete this record?</p>
                </>
                <div className="flex gap-2">
                  <Button
                    className="bg-blue-500 text-white"
                    onPressChange={post}
                  >
                    Yes
                  </Button>

                  <Button
                    className="bg-blue-500 text-white"
                    onPress={() => onOpenChange(false)}
                  >
                    No
                  </Button>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    </>
  );
};

export default Vmsp_banksDeleteModal;
