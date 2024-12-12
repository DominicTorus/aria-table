import ContextMenuEvents from '../VPT_UF/VPT_EVENTS/components/ContextMenu/ContextMenu';
import DataFabricContextMenu from './dataFabric/DataFabricContextMenu';
import DataFlowContextMenu from './dataFlowDiagram/dataFlowContextMenu';
import ProcessFabricContextMenu from './processFabric/ProcessFabricContextMenu';
import SecurityFabricContextMenu from './securityFabric/SecurityFabricContextMenu';
import UserFabricContextMenu from './userFabric/UserFabricContextMenu';

export default function ContextMenuSelector(props) {
  console.log(props, '<<--props-->>');
  const cycleContextMenu = (fabric) => {
    switch (fabric) {
      case 'DF-ERD':
        return <DataFabricContextMenu {...props} />;
      case 'UF-UFM':
      case 'UF-UFW':
      case 'UF-UFD':
        return <UserFabricContextMenu {...props} />;
      case 'PF-PFD':
        return <ProcessFabricContextMenu {...props} />;
      case 'SF':
        return <SecurityFabricContextMenu {...props} />;
      case 'events':
        return <ContextMenuEvents {...props} />;
      case 'DF-DFD':
        return <DataFlowContextMenu {...props} />;
      default:
        return null;
    }
  };
  return cycleContextMenu(props.fabric);
}
