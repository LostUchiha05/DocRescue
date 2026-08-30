import csv


def export_to_csv(data, output_path):
    fields = []

    for key, value in data.items():
        if isinstance(value, (dict, list)):
            value = str(value)

        fields.append((key, value))

    with open(output_path, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        writer.writerow(["Field", "Value"])

        for key, value in fields:
            writer.writerow([key, value])