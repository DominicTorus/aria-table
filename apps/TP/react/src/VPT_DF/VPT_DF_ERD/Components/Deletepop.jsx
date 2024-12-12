import { Dialog } from 'primereact/dialog';
import React from 'react';

/**
 * Renders a dialog component for deleting an entity or relationship.
 * @param {Object} props - The component props.
 * @param {string} props.type - The type of entity or relationship being deleted.
 * @param {boolean} props.deletepop - Whether the delete dialog is visible.
 * @param {function} props.setDeletepop - Callback function to toggle the visibility of the delete dialog.
 * @param {string} props.id - The ID of the entity or relationship being deleted.
 * @param {Object} props.node - The node object representing the entity or relationship being deleted.
 * @param {function} props.deleteNode - Callback function to delete the entity or relationship.
 * @param {function} props.handlekeyDelete - Callback function to handle key delete action.
 * @param {string} props.path - The path of the entity or relationship being deleted.
 * @return {JSX.Element} The delete dialog component.
 */
const Deletepop = ({
  type,
  deletepop,
  setDeletepop,
  id,
  node,
  deleteNode,
  handlekeyDelete,
  path,
}) => {
  return (
    <Dialog
      resizable={false}
      draggable={false}
      header={type === 'Er' ? `Entity - ${node?.data.label}` : path}
      headerStyle={{
        height: '40px',
        textAlign: 'center',
        textTransform: 'capitalize',
        backgroundColor: '#D3D3D3',
      }}
      visible={deletepop}
      onHide={() => setDeletepop(!deletepop)}
      width={50}
      closable={false}
      style={{ Radius: '10px', top: '0%' }}
    >
      <div className="mt-[20px]">
        {type === 'Er' ? (
          <span className="mb-[40px] text-[#36454F]">
            Are you sure you want to delete this Node ? <br />
            This node may have Relationship
          </span>
        ) : (
          <span style={{ color: '#36454F', marginBottom: '40px' }}>
            Are you sure you want to delete this {path}? <br />
          </span>
        )}
        <div className="ml-[145px] mt-[30px] flex">
          <button
            className="k mr-1 rounded-md border border-gray-400 bg-gray-300 px-[15px] 
             py-[7px]   text-black transition-all 
             duration-200 hover:scale-105 hover:border-2 hover:border-gray-400  hover:bg-gray-300"
            onClick={() => setDeletepop(false)}
          >
            Discard
          </button>

          {type === 'Er' ? (
            <button
              className="ml-2 rounded-md  border border-gray-400 bg-white px-[15px] 
            py-[7px] text-black  transition-all
            duration-200 hover:scale-105  hover:border-2 hover:border-gray-400
            hover:bg-red-400 hover:text-white"
              onClick={() => deleteNode(id, node)}
            >
              <span className="del">Delete</span>
            </button>
          ) : (
            <button
              style={{
                color: 'black',
                paddingLeft: '20px',
                paddingRight: '20px',
                borderWidth: '0.5px',
              }}
              onClick={() => {
                handlekeyDelete(path);
              }}
            >
              <span className="del">Delete</span>
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default Deletepop;
