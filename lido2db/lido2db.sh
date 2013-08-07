# Count all distinct text values in a collection of LIDO files
for in in data/*.xml
do
  python lido2db.py $in
done
