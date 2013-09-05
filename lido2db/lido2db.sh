# Count all distinct text values in a collection of LIDO files
for in in lido_files/*.xml
do
  python lido2db.py $in
done
