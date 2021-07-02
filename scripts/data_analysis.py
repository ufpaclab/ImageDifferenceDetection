import csv, json
from Table import Table

def main():
    rawData = readResultsFile('Difference Detection - Results.csv')
    parsedData = parseData(rawData)

    with open("./output.json", "w") as file:
        file.write(str(json.dumps(parsedData, indent=2)));

def readResultsFile(fileName):
    rows = []
    with open(fileName) as resultsFile:
        [rows.append(entry) for entry in csv.reader(resultsFile, delimiter=',')]
        keys = rows[0]
        data = rows[1:-1]
        for index, values in enumerate(data):
            data[index] = dict(zip(keys, values))
    return Table(data)

def parseData(rawData):
    data = {}
    for subject_id in rawData.GetAllDistinctValues("subject_id"):
        subjectData = {}
        subjectTable = rawData \
            .WhereEqual("subject_id", subject_id) \
            .Sort(["trial_index"])

        sex = json.loads(subjectTable.WhereEqual("trial_index", "2").data[0]["responses"])["sex"]
        age = json.loads(subjectTable.WhereEqual("trial_index", "3").data[0]["responses"])["age"]
        firstEntry = subjectTable.data[0]
        PROLIFIC_PID = firstEntry["PROLIFIC_PID"]
        STUDY_ID = firstEntry["STUDY_ID"]
        SESSION_ID = firstEntry["SESSION_ID"]

        subjectImageTable = subjectTable \
            .WhereCheck(lambda entry: entry["image"] != "")

        for image in subjectImageTable.GetAllDistinctValues("image"):
            imageData = {}
            imageTable = subjectImageTable.WhereEqual("image", image)
            
            def getResponse(index, entry):
                imageQuality = ""
                value = 0
                if entry["response"] != "":
                    imageQuality = "Realistic"
                    value = entry["response"]
                else:
                    responses = json.loads(entry["responses"])
                    imageQuality = list(responses.keys())[0]
                    value = responses[imageQuality]
                imageData[imageQuality] = {
                        "value": int(value),
                        "rt": float(entry["rt"])
                }
            imageTable.ForEach(getResponse)

            allResponsesFound = len(list(imageData.keys())) == 4
            if allResponsesFound:
                subjectData[image] = imageData
        
        allSubjectDataPresent = True
        if allSubjectDataPresent:
            data[subject_id] = {
                "sex": sex,
                "age": age,
                "subject_id": int(subject_id),
                "PROLIFIC_PID": PROLIFIC_PID,
                "STUDY_ID": STUDY_ID,
                "SESSION_ID": SESSION_ID,
                "images": subjectData
            }
    return data

if __name__ == "__main__":
    main()

#by image
#    mean and std and count
#        difference
#        likely
#        complicated
#        hard

#    mean and std
#        rt