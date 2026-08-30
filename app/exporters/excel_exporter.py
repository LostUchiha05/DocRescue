from openpyxl import Workbook


def export_to_excel(data, file_path):

    workbook = Workbook()

    sheet = workbook.active
    sheet.title = "Document"

    sheet.append(["Field", "Value"])

    def flatten(obj, prefix=""):

        rows = []

        if isinstance(obj, dict):

            for key, value in obj.items():

                new_prefix = f"{prefix}.{key}" if prefix else key

                rows.extend(
                    flatten(value, new_prefix)
                )

        elif isinstance(obj, list):

            for index, value in enumerate(obj):

                new_prefix = f"{prefix}[{index}]"

                rows.extend(
                    flatten(value, new_prefix)
                )

        else:

            rows.append([
                prefix,
                str(obj)
            ])

        return rows

    rows = flatten(data)

    for row in rows:
        sheet.append(row)

    sheet.column_dimensions["A"].width = 50
    sheet.column_dimensions["B"].width = 100

    workbook.save(file_path)