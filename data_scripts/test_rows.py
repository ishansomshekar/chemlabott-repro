import csv

with open('summary_words.csv', 'wb') as csvfile:
	writer = csv.writer(csvfile)
	with open('data_types') as f:
		for line in f:

			x = line[1:len(line)-2]
			x = x.split("_")

			writer.writerow(x)
	f.close()
csvfile.close