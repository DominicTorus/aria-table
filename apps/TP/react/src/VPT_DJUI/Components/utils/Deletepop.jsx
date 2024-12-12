import { Dialog } from 'primereact/dialog';
import React from 'react';

const Deletepop = ({ deletepop, setDeletepop, id, node, deleteNode }) => {
  return (
    <div>
      <Dialog
        resizable={false}
        draggable={false}
        header={`${node && node?.data.label}`}
        headerStyle={{
          height: '40px',
          textAlign: 'center',
          textTransform: 'capitalize',
          backgroundColor: '#D3D3D3',
        }}
        visible={deletepop}
        onHide={() => setDeletepop(false)}
        width={50}
        closable={false}
        style={{ Radius: '10px', top: '0%' }}
      >
        <div className="mt-[20px]">
          <span className="mb-[40px] text-[#36454F]">
            Are you sure you want to delete this Node ? <br />
            This node may have Relationship
          </span>
          <div className="ml-[145px] mt-[30px] flex">
            <button
              className="k mr-1 rounded-md border border-gray-400 bg-gray-300 px-[15px] 
              py-[7px]   text-black transition-all 
              duration-200 hover:scale-105 hover:border-2 hover:border-gray-400  hover:bg-gray-300"
              onClick={() => setDeletepop(false)}
            >
              Discard
            </button>

            <button
              className="ml-2 rounded-md  border border-gray-400 bg-white px-[15px] 
              py-[7px] text-black  transition-all
              duration-200 hover:scale-105  hover:border-2 hover:border-gray-400
              hover:bg-red-400 hover:text-white"
              onClick={() => deleteNode(id, node)}
            >
              Delete
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Deletepop;
