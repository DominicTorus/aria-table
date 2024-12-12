/* eslint-disable */
import { Editor } from '@monaco-editor/react';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import Output from './Output';

const CodeEditor = ({ object, fabricsKey, nodeName, customCode, onChange }) => {
  const monacoRef = useRef();
  const [objectValue, setObjectValue] = useState({});
  const [value, setValue] = useState('');
  const [language, setLanguage] = useState('javascript');

  function ShowAutocompletion(obj) {
    try {
      // Helper function to return the monacoRef.current completion item type of a thing
      function getType(thing, isMember) {
        isMember =
          isMember == undefined
            ? typeof isMember == 'boolean'
              ? isMember
              : false
            : false; // Give isMember a default value of false
        switch ((typeof thing).toLowerCase()) {
          case 'object':
            return monacoRef.current.languages.CompletionItemKind.Class;
          case 'function':
            return isMember
              ? monacoRef.current.languages.CompletionItemKind.Method
              : monacoRef.current.languages.CompletionItemKind.Function;
          default:
            return isMember
              ? monacoRef.current.languages.CompletionItemKind.Property
              : monacoRef.current.languages.CompletionItemKind.Variable;
        }
      }
      // Register object that will return autocomplete items
      monacoRef.current.languages.registerCompletionItemProvider('javascript', {
        // Run this function when the period or open parenthesis is typed (and anything after a space)
        triggerCharacters: ['.', '('],

        // Function to generate autocompletion results
        provideCompletionItems: function (model, position, token) {
          try {
            var last_chars = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 0,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            var words = last_chars.replace('\t', '').split(' ');
            var active_typing = words[words.length - 1]; // What the user is currently typing (everything after the last space)

            // This if statement adds support for autocomplete inside if statements and stuff
            if (active_typing.includes('(')) {
              active_typing = active_typing.split('(');
              active_typing = active_typing[active_typing.length - 1];
            }

            // If the last character typed is a period then we need to look at member objects of the obj object
            var is_member =
              active_typing.charAt(active_typing.length - 1) == '.';

            // Array of autocompletion results
            var result = [];
            let pushedKey = [];
            Object.keys(obj).forEach((key) => {
              if (pushedKey.includes(key)) return;
              let ds = '';
              pushedKey.push(key);
              if (!is_member) {
                try {
                  ds = obj[key].__proto__.constructor.name;
                } catch (e) {
                  ds = typeof obj[key];
                }

                result.push({
                  label: key,
                  insertText: key,
                  detail: ds,
                  kind: getType(obj[key], is_member),
                });
              }
            });
            // Used for generic handling between member and non-member objects
            var last_token = obj;
            var prefix = '';

            if (is_member) {
              // Is a member, get a list of all members, and the prefix
              var parents = active_typing
                .substring(0, active_typing.length - 1)
                .split('.');

              if (parents != undefined && parents != null) {
                last_token = obj[parents[0]];

                if (last_token !== undefined && last_token !== null) {
                  prefix = parents[0];

                  for (var i = 1; i < parents.length; i++) {
                    var propToLookFor = parents[i];

                    // Support for arrays
                    var isPropAnArray =
                      propToLookFor.charAt(propToLookFor.length - 1) == ']';
                    if (isPropAnArray)
                      propToLookFor = propToLookFor.split('[')[0];

                    if (last_token.hasOwnProperty(propToLookFor)) {
                      prefix += '.' + propToLookFor;
                      last_token = last_token[propToLookFor];

                      if (isPropAnArray && Array.isArray(last_token)) {
                        last_token = last_token[0];
                      }
                    } else {
                      // Not valid
                      return result;
                    }
                  }

                  prefix += '.';
                  // Array properties
                  if (Array.isArray(last_token)) last_token = { length: 0 };

                  // Get all the child properties of the last token
                  for (var prop in last_token) {
                    // Do not show properites that begin with "__"
                    if (
                      last_token.hasOwnProperty(prop) &&
                      !prop.startsWith('__')
                    ) {
                      // Get the detail type (try-catch) incase object does not have prototype
                      var details = '';
                      try {
                        details = last_token[prop].__proto__.constructor.name;
                      } catch (e) {
                        details = typeof last_token[prop];
                      }

                      if (pushedKey.includes(prefix + prop)) break;
                      // Create completion object
                      pushedKey.push(prefix + prop);
                      var to_push = {
                        label: prefix + prop,
                        kind: getType(last_token[prop], is_member),
                        detail: details,
                        insertText: prop,
                      };

                      // Change insertText and documentation for functions
                      // if (to_push.detail.toLowerCase() == "function") {
                      //   to_push.insertText += "(";
                      //   to_push.documentation = last_token[prop]
                      //     .toString()
                      //     .split("{")[0]; // Show function prototype in the documentation popup
                      // }

                      // Add to final results
                      result.push(to_push);
                    }
                  }
                  // Loop through all the parents the current one will have (to generate prefix)
                }
              }
            }

            return {
              suggestions: result,
            };
          } catch (err) {
            console.error(err.message);
          }
          // Split everything the user has typed on the current line up at each space, and only look at the last word
        },
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    if (monacoRef.current && object && !_.isEqual(object, objectValue)) {
      const value = _.cloneDeep(object);
      ShowAutocompletion(value);
      setObjectValue(value);
    }
  }, [object, monacoRef.current]);

  useEffect(() => {
    setValue(customCode);
  }, [customCode]);

  const beforeMount = (monaco) => {
    monacoRef.current = monaco;
  };

  return (
    <div className="w-full p-4 pt-2">
      <div className="flex gap-7">
        <div className="w-1/2">
          <div className="mt-3">
            <Editor
              ref={monacoRef}
              options={{ selectOnLineNumbers: true }}
              height="87vh"
              theme="vs-dark"
              language={'javascript'}
              value={value}
              onChange={(value) => {
                setValue(value);
                onChange(value);
              }}
              beforeMount={beforeMount}
            />
          </div>
        </div>
        <div className="w-1/2 overflow-hidden">
          <Output
            fabricsKey={fabricsKey}
            nodeName={nodeName}
            editorRef={value}
            language={language}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
