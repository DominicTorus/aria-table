import { useEffect } from "react";
import { TabList } from "react-aria-components";

const useApplyThemeStyles = (selectedTheme, setTablePage) => {
  useEffect(() => {
    // Utility function to apply theme to a specific element
    const applyStyles = (element, styles) => {
      if (element) {
        Object.keys(styles).forEach((key) => {
          element.style[key] = styles[key];
        });
      }
    };

    const initializeTheme = () => {
      const gorRuleSidebar = document.querySelector(".grl-dg__aside");
      const nodesWrapper = document.querySelector(".grl-dg__aside__menu");
      const searchContent = document.querySelector(
        ".grl-dg__aside__menu__content div span"
      );
      const reactFlowBackground = document.querySelector(
        ".content-wrapper .react-flow div .react-flow__renderer"
      );
      const reactFlowNode = document.querySelector(
        ".content-wrapper .react-flow .react-flow .react-flow__renderer .react-flow__pane .react-flow__viewport .react-flow__nodes"
      );

      const antDropdown = document.querySelector(
        ".ant-dropdown"
      );

      const searchContentInput = document.querySelector(
        ".grl-dg__aside__menu__content div span input"
      );
      const sidebar = document.querySelector(".grl-dg__aside__side-bar");
      const sidebarTabsContent = sidebar.querySelector(
        ".grl-dg__aside__side-bar__top"
      );
      const sidebarTabsBtns = sidebarTabsContent.querySelectorAll("button");

      console.log(sidebarTabsContent, sidebarTabsBtns, "sidebarTabsBtns");
      const headingComConatiner = document.querySelector(
        ".grl-dg__aside__menu__heading"
      );
      const headingCom = document.querySelector(
        ".grl-dg__aside__menu__heading__text span"
      );
      const mainGraph = document.querySelector(".grl-dg__graph");
      const gragging = document.querySelectorAll(".grl-dn__header");
      const nodeWrapper = document.querySelectorAll(
        ".grl-dn div .grl-dn__header__text"
      );
      const nodeContainedWrapper = document.querySelector(
        ".grl-dg__aside__menu__components"
      );
      const tabsList = document.querySelectorAll(".ant-tabs-tab-btn");
      const removeBtns = document.querySelectorAll(".ant-tabs-tab-remove");

      // Apply styles
      applyStyles(gorRuleSidebar, { backgroundColor: selectedTheme?.bg });
      applyStyles(nodesWrapper, { backgroundColor: selectedTheme?.bg });
      applyStyles(searchContent, {
        backgroundColor: selectedTheme?.bg,
        color: selectedTheme?.text,
      });

      if (sidebarTabsBtns && sidebarTabsBtns.length > 0) {
        sidebarTabsBtns.forEach((item) => {
          applyStyles(item, {
            backgroundColor: selectedTheme?.bg,
            color: selectedTheme?.text,
            fontSize: "0.72vw",
          });
        });
      }

      if (reactFlowBackground) {
        applyStyles(reactFlowBackground, {
          backgroundColor: selectedTheme?.bgCard,
        });
        if (reactFlowNode) {
          const nodesFlowHolder = reactFlowNode.querySelectorAll(
            ".react-flow__node .grl-graph-node div"
          );
          const nodesFlow = reactFlowNode.querySelectorAll(
            ".react-flow__node .grl-graph-node div .grl-dn__header"
          );

          console.log(nodesFlowHolder, nodesFlow, "nodesFlowHolder");

          if (nodesFlowHolder) {
            nodesFlowHolder.forEach((node) => {
              const actionBtn = node.querySelector(".grl-dn__header__actions");
              if (actionBtn) {
                const acBtn = actionBtn.querySelector("button");
                if (acBtn) {
                  applyStyles(acBtn, {
                    backgroundColor: selectedTheme?.bg,
                    color: selectedTheme?.text,
                  });
                }
              }

              applyStyles(node, {
                backgroundColor: selectedTheme?.bg,
                color: selectedTheme?.text,
                padding: "0.3vw",
              });
            });
          }
        }
      }

      

      applyStyles(searchContentInput, {
        backgroundColor: selectedTheme?.bgCard,
        color: selectedTheme?.text,
        paddingLeft: "0.55vw",
        borderRadius: "12px",
      });
      applyStyles(headingComConatiner, {
        backgroundColor: selectedTheme?.bg,
        height: "5.5vh",
      });
      applyStyles(sidebar, { borderColor: selectedTheme?.border });
      applyStyles(headingCom, {
        color: `${selectedTheme?.text}80`,
        fontSize: "1vw",
      });
      if (nodeWrapper && nodeWrapper.length > 0) {
        nodeWrapper.forEach((node) => {
          const heading = node.children[0];
          const sub_heading = node.children[1];
          applyStyles(heading, {
            color: selectedTheme?.text,
            fontWeight: "600",
            fontSize: "0.72vw",
          });
          applyStyles(sub_heading, {
            color: `${selectedTheme?.text}30`,
            fontWeight: "400",
            fontSize: "0.62vw",
          });
        });
      }

      if (tabsList && tabsList.length > 0) {
        tabsList.forEach((item) => {
          const tab = item.querySelectorAll("div");
          applyStyles(tab[0], {
            backgroundColor: selectedTheme?.bg,
            color: selectedTheme?.text,
            fontSize: "0.72vw",
          });
        });
      }
      if (removeBtns && removeBtns.length > 0) {
        removeBtns.forEach((item) => {
          applyStyles(item, {
            backgroundColor: selectedTheme?.bg,
            color: selectedTheme?.text,
            fontSize: "0.72vw",
          });
        });
      }
      if (gragging && gragging.length > 0) {
        gragging.forEach((node) => {
          applyStyles(node, { height: "8vh" });
        });
      }
      if (mainGraph?.children[0]) {
        applyStyles(mainGraph.children[0], {
          backgroundColor: selectedTheme?.bg,
          borderColor: selectedTheme?.bgCard,
        });
      }
      if (nodeContainedWrapper) {
        applyStyles(nodeContainedWrapper, {
          gap: "0.3vw",
          overflow: "hidden",
          overflowY: "hidden",
          paddingTop: "0.3vw",
          paddingBottom: "0.3vw",
          paddingLeft: "0.55vw",
          paddingRight: "0.55vw",
        });
      }

      // Update draggable elements
      const draggableElements = document.querySelectorAll(
        ".draggable-component"
      );
      draggableElements.forEach((node) => {
        const child = node.querySelector(":scope > * > *") || node;
        applyStyles(child, {
          backgroundColor: selectedTheme?.bgCard,
          borderColor: selectedTheme?.border,
        });
      });

      // Update table page
      const tablePage = document.querySelector(".grl-dt");
      const tablePageHeader = document.querySelector(".grl-dt__command-bar");
      const tablePageHeaderDD = document.querySelector(".ant-select");
      const tablePageHeaderDDItems = document.querySelector(
        ".ant-select-dropdown"
      );
      const tableContainedcontainer =
        document.querySelector(".grl-dt__container");
      console.log(tablePageHeaderDDItems, "tablePageHeaderDDItems");
      console.log(tablePageHeaderDD, "tablePageHeaderDD");
      const tablePageHeaderHolder = tablePageHeader?.querySelector("div");
      const tablePageHeaderHolderBtn =
        tablePageHeaderHolder?.querySelectorAll("button");
      const navbar = document.querySelector(".ant-tabs-nav");

      console.log(tablePageHeaderHolder, "");

      if (antDropdown) {
        // Apply styles to the dropdown container

        const antDropdownMenu = antDropdown.querySelector(".ant-dropdown-menu")
        console.log(antDropdown,antDropdownMenu,"Dropdown-->>>>")

        const applyDropdownStyles = () => {


          applyStyles(antDropdownMenu, {
            backgroundColor: selectedTheme?.bg,
            color: selectedTheme?.text,
            fontSize: "0.72vw",
            border: `1px solid ${selectedTheme?.border}`,
          });
        };
      
        // Apply styles to the dropdown items
        const applyDropdownItemStyles = () => {
          const antDropdownItems = antDropdownMenu.querySelectorAll("li"); // Re-query inside to catch dynamic changes
          antDropdownItems.forEach((item) => {
            if (item.classList.contains("ant-dropdown-menu-item")) {
              applyStyles(item, {
                color: selectedTheme?.text,
                fontSize: "0.72vw",
              });
            }
      
            if (item.classList.contains("ant-dropdown-menu-item-danger")) {
              const contents = item.querySelector("div");
              if (contents) {
                const spans = contents.querySelectorAll("span");
                spans.forEach((span) => {
                  applyStyles(span, {
                    fontSize: "0.72vw",
                  });
                });
              }
            }
          });
        };
      
        // Initial styling
        applyDropdownStyles();
        applyDropdownItemStyles();
      
 
        
      }

      if (
        tablePage &&
        tablePageHeader &&
        tablePageHeaderHolder &&
        tableContainedcontainer
      ) {
        setTablePage(true);
        if (
          selectedTheme &&
          (selectedTheme?.name === "Eclipse" ||
            selectedTheme?.name === "Midnight")
        ) {
          console.log(selectedTheme, "names");
          tableContainedcontainer.setAttribute("data-theme", "dark");
        } else {
          tableContainedcontainer.setAttribute("data-theme", "light");
        }

        // Apply styles directly to elements
        applyStyles(tablePage, { backgroundColor: selectedTheme?.bg });
        applyStyles(tablePageHeader, {
          backgroundColor: selectedTheme?.bg,
          borderColor: selectedTheme?.bg,
          height: "5.5vh",
        });
        applyStyles(tableContainedcontainer, {
          backgroundColor: selectedTheme?.bg,
          margin: "0.85vw",
        });

        applyStyles(tablePageHeaderHolder, { color: selectedTheme?.text });
        if (tablePageHeaderHolderBtn && tablePageHeaderHolderBtn.length > 0) {
          tablePageHeaderHolderBtn.forEach((item) => {
            applyStyles(item, {
              color: selectedTheme?.text,
              backgroundColor: selectedTheme?.bgCard,
              border: `1px solid ${selectedTheme?.border}70`,
              borderRadius: "5px",
              height: "4.5vh",
              fontSize: "0.72vw",
            });
          });
        }

        if (tablePageHeaderDD) {
          const Dropdown = tablePageHeaderDD?.querySelector(
            ".ant-select-selector"
          );
          applyStyles(Dropdown, {
            backgroundColor: selectedTheme?.bgCard,
            border: `1px solid ${selectedTheme?.border}70`,
            borderRadius: "5px",
            height: "4.5vh",
            fontSize: "0.72vw",
            color: selectedTheme?.text,
          });
        }

        // if (antDropdown) {
        //   applyStyles(antDropdown, {
        //     backgroundColor: selectedTheme?.bg,
        //     color: selectedTheme?.text,
        //     fontSize: "0.72vw",
        //     border: `1px solid ${selectedTheme?.border}`,
        //   });
  
        //   const antDropdownItems = antDropdown.querySelectorAll("li");
        //   console.log(antDropdownItems, "antDropdownItems");
  
        //   antDropdownItems.forEach((item) => {
        //     if (item.classList.contains("ant-dropdown-menu-item")) {
        //       applyStyles(item, {
        //         color: selectedTheme?.text,
        //         fontSize: "0.72vw",
        //       });
        //     }
  
        //     if (item.classList.contains("ant-dropdown-menu-item-danger")) {
        //       const contents = item.querySelector("div");
        //       if (contents) {
        //         const spans = contents.querySelectorAll("span");
        //         spans.forEach((span) => {
        //           applyStyles(span, {
        //             fontSize: "0.72vw",
        //           });
        //         });
        //       }
        //     }
        //   });
        // }

        
        

        if (tablePageHeaderDDItems) {
          applyStyles(tablePageHeaderDDItems, {
            backgroundColor: selectedTheme?.bgCard,
            border: `1px solid ${selectedTheme?.border}70`,
            borderRadius: "5px",
            height: "11.5vh",
            fontSize: "0.72vw",
            color: selectedTheme?.text,
          });

          const applyDropdownItemStyles = () => {
            const DropdownItems = tablePageHeaderDDItems.querySelectorAll(
              '.ant-select-item[aria-selected="false"]'
            );
            const selectedItems = Array.from(
              tablePageHeaderDDItems.querySelectorAll(".ant-select-item")
            ).filter((item) => item.getAttribute("aria-selected") === "true");

            console.log(selectedItems, DropdownItems, "itemss--->>>");

            DropdownItems.forEach((item) => {
              applyStyles(item, {
                borderRadius: "10px",
                height: "4.5vh",
                fontSize: "0.72vw",
                color: `${selectedTheme?.text}90`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              });
            });

            if (selectedItems && selectedItems.length > 0) {
              selectedItems.forEach((item) => {
                applyStyles(item, {
                  border: `1px solid ${selectedTheme?.border}90`,
                  borderRadius: "5px",
                  height: "4.5vh",
                  fontSize: "0.72vw",
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                });
              });
            }
          };

          applyDropdownItemStyles();

          const observer = new MutationObserver(() => {
            applyDropdownItemStyles();
          });

          // Observe changes in the `tablePageHeaderDDItems`
          observer.observe(tablePageHeaderDDItems, {
            childList: true, // Watch for additions or removals of child elements
            subtree: true, // Observe the entire subtree (not just direct children)
            attributes: true, // Watch for attribute changes (e.g., aria-selected)
            attributeFilter: ["aria-selected"], // Specifically watch for changes in aria-selected
          });

          // Cleanup observer when component unmounts or when you're done
          return () => {
            observer.disconnect();
          };
        }

        if (navbar) {
          let style = document.querySelector("#dynamicStyles");
          if (!style) {
            style = document.createElement("style");
            style.id = "dynamicStyles";
            document.head.appendChild(style);
          }

          style.textContent += `
          .ant-tabs-nav::before {
            border-color: ${selectedTheme?.border} !important; /* Change the border color */
            border-width: 1px; /* Optional: Adjust border width */
          }`;
        }
      } else {
        setTablePage(false);
      }
    };

    initializeTheme();

    // MutationObserver for dynamic updates
    const observer = new MutationObserver(initializeTheme);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [selectedTheme, setTablePage]);
};

export default useApplyThemeStyles;