import 'package:flutter/material.dart';

class CustomAutocomplete extends StatefulWidget {
  final List<String> listItem;
  final List<IconData>? iconList;
  final Function(String)? onSelected;
  final TextEditingController controller;
  final double? width;
  final String? hintText;
  final String? label;
  final String? helpertext;
  final bool withClear;
  final String? errorText;
  final String? labelPosition;
  final bool borderedInput;
  final bool isRoundedCorner;

  const CustomAutocomplete({
    super.key,
    required this.listItem,
    this.iconList,
    required this.controller,
    this.onSelected,
    this.width,
    this.hintText,
    this.label,
    this.helpertext,
    required this.withClear,
    this.errorText,
    this.labelPosition,
    required this.borderedInput,
    required this.isRoundedCorner,
  });

  @override
  State<CustomAutocomplete> createState() => _CustomAutocompleteState();
}

class _CustomAutocompleteState extends State<CustomAutocomplete> {
  bool isCenterLabel = false;

  @override
  void initState() {
    super.initState();
    if (widget.labelPosition != null && widget.labelPosition == 'center') {
      setState(() {
        isCenterLabel = !isCenterLabel;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.width,
      child: Column(
          crossAxisAlignment: isCenterLabel
              ? CrossAxisAlignment.center
              : CrossAxisAlignment.start,
          children: [
            widget.labelPosition != null
                ? Text(widget.label ?? '')
                : Container(),
            const SizedBox(height: 10.0),
            Autocomplete<String>(
              optionsBuilder: (TextEditingValue textEditingValue) {
                List<String> allItems = [...widget.listItem];

                if (textEditingValue.text.isEmpty) {
                  return const Iterable<String>.empty();
                }
                return allItems.where((String item) {
                  return item
                      .toLowerCase()
                      .contains(textEditingValue.text.toLowerCase());
                });
              },
              onSelected: widget.onSelected,
              fieldViewBuilder: (
                BuildContext context,
                TextEditingController controller,
                FocusNode focusNode,
                VoidCallback onFieldSubmitted,
              ) {
                return TextFormField(
                  controller: controller,
                  focusNode: focusNode,
                  decoration: InputDecoration(
                    labelText:
                        widget.labelPosition != null ? null : widget.label,
                    hintText: widget.hintText,
                    border: widget.borderedInput
                        ? widget.isRoundedCorner
                            ? const OutlineInputBorder(
                                borderRadius:
                                    BorderRadius.all(Radius.circular(50)))
                            : const OutlineInputBorder()
                        : null,
                    helperText: widget.helpertext,
                    errorText: widget.errorText,
                    suffixIcon: widget.withClear
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            iconSize: 15,
                            onPressed: () {
                              controller.clear();
                            },
                          )
                        : null,
                  ),
                  validator: (value) {
                    if (value != null) {
                      return null;
                    }
                    return 'Required';
                  },
                  autovalidateMode: AutovalidateMode.onUserInteraction,
                );
              },
              optionsViewBuilder: (
                BuildContext context,
                AutocompleteOnSelected<String> onSelected,
                Iterable<String> options,
              ) {
                return Align(
                  alignment: Alignment.topLeft,
                  child: Material(
                    elevation: 4.0,
                    child: Container(
                      constraints: const BoxConstraints(maxHeight: 200),
                      width: double.infinity,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(4.0),
                      ),
                      child: SingleChildScrollView(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: options.map((String option) {
                            int index = widget.listItem.indexOf(option);
                            IconData? iconData = widget.iconList != null
                                ? widget.iconList![index]
                                : null;
                            return GestureDetector(
                              onTap: () {
                                onSelected(option);
                              },
                              child: ListTile(
                                leading: widget.iconList != null
                                    ? Icon(iconData)
                                    : null,
                                title: Text(option),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ]),
    );
  }
}
