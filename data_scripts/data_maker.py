import csv
import collections


upper_cap = 1.0
lower_cap = 0.0

counter_dict = collections.defaultdict(int)
correct_dict = collections.defaultdict(int)
strong_dict = collections.defaultdict(int)
weak_dict = collections.defaultdict(int)
# exclusions = set([3, 4, 8, 12, 16, 18, 19])
better_percent = collections.defaultdict(int)
with open('chemlabott.csv') as csvfile:
	reader = csv.DictReader(csvfile);
	for row in reader:
		resp = row['t-response'][1:len(row['t-response'])-1]
		if (resp == "right"):
			better_percent[row['workerid']] += (1.0/66)
csvfile.close()

for k in better_percent:
	if (better_percent[k] < upper_cap and better_percent[k] > lower_cap):
		print k, " : ", better_percent[k]



with open('chemlabott.csv') as csvfile:
	reader = csv.DictReader(csvfile);
	for row in reader:
		fill = row['filler'][1:len(row['filler'])-1]
		if (fill == 'false' and better_percent[row['workerid']] < upper_cap and better_percent[row['workerid']] > lower_cap):
			# print row['category'], row['t-response']
			cat = row['category'][1:len(row['category'])-1]
			resp = row['t-response'][1:len(row['t-response'])-1]
			# print resp
			corr = row['t-correct']
			# print corr
			counter_dict[cat] += 1 
			if (resp == "right"):
				strong_dict[cat] += 1
			else:
				weak_dict[cat] += 1
			if (resp == "right" and corr == "1"):
				correct_dict[cat] += 1
			if (resp == "left" and corr == "0"):
				correct_dict[cat] += 1
csvfile.close()

keys = ['some_strong_some', 'some_weak_some', 'four_strong_four', 'four_weak_four', 'six_strong_six', 'six_weak_six']
for i in xrange(0, len(keys), 2):
	print "#############################"
	print ""
	print keys[i].split("_")[0] + " / " + keys[i].split("_")[2]
	print "Strong: ", strong_dict[keys[i]]/float(counter_dict[keys[i]])
	print "Weak: ", strong_dict[keys[i+1]]/float(counter_dict[keys[i+1]])
	print ""

paired_keys = ['some_strong_four', 'some_weak_four','four_strong_some', 'four_weak_some','some_strong_six', 'some_weak_six','six_strong_some', 'six_weak_some','six_strong_four', 'six_weak_four','four_strong_six', 'four_weak_six']
for i in xrange(0, len(paired_keys), 4):
	print "#############################"
	print ""
	print paired_keys[i].split("_")[0] + " / " + paired_keys[i].split("_")[2]
	print "Strong: ", (strong_dict[paired_keys[i]]+ strong_dict[paired_keys[i+2]])/(float(counter_dict[paired_keys[i]] + counter_dict[paired_keys[i+2]]))
	print "Weak: ", (strong_dict[paired_keys[i+1]]+ strong_dict[paired_keys[i+3]])/(float(counter_dict[paired_keys[i+1]] + counter_dict[paired_keys[i+3]]))
	print ""
