def export_to_txt(data, file_path):

    def format_key(key):
        """Convert JSON keys into readable titles."""
        return str(key).replace("_", " ").title()

    def write_value(file, value, level=0, list_item_name=None):

        indent = "    " * level

        # -------------------------
        # DICTIONARY
        # -------------------------
        if isinstance(value, dict):

            for key, child_value in value.items():

                title = format_key(key)

                # If simple value → Key: Value
                if not isinstance(child_value, (dict, list)):
                    file.write(
                        f"{indent}{title}: {child_value}\n"
                    )

                else:
                    # Complex value → Heading
                    file.write(
                        f"\n{indent}{title}\n"
                    )
                    file.write(
                        f"{indent}{'-' * len(title)}\n"
                    )

                    write_value(
                        file,
                        child_value,
                        level + 1
                    )

        # -------------------------
        # LIST
        # -------------------------
        elif isinstance(value, list):

            for index, item in enumerate(value, start=1):

                if isinstance(item, dict):

                    # Example:
                    # Project 1
                    # ---------
                    item_title = list_item_name or "Item"

                    file.write(
                        f"\n{indent}{item_title} {index}\n"
                    )
                    file.write(
                        f"{indent}{'-' * len(item_title + ' ' + str(index))}\n"
                    )

                    write_value(
                        file,
                        item,
                        level + 1
                    )

                else:

                    # Simple list values
                    file.write(
                        f"{indent}- {item}\n"
                    )

        # -------------------------
        # SIMPLE VALUE
        # -------------------------
        else:

            file.write(
                f"{indent}{value}\n"
            )

    with open(file_path, "w", encoding="utf-8") as file:

        # Document type first
        if isinstance(data, dict) and "document_type" in data:

            document_type = data["document_type"]

            file.write("DOCUMENT TYPE\n")
            file.write("=============\n\n")
            file.write(f"{document_type}\n\n")

            # Remove document_type so it isn't printed twice
            remaining_data = {
                key: value
                for key, value in data.items()
                if key != "document_type"
            }

            write_value(file, remaining_data)

        else:

            write_value(file, data)

