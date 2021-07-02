import copy

def canBeConvertedToFloat(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

class Table:
    def __init__(self, data):
        self.data = data
        
    def Sort(self, keys):
        def createCompositeKey(entry):
            compositeKey = []
            for key in keys:
                value = entry[key]
                try:
                    value = float(value)
                except(Exception):
                    pass
                compositeKey.append(value)
            return tuple(compositeKey)
        sortedData = sorted(copy.deepcopy(self.data), key=createCompositeKey)
        return Table(sortedData)

    def WhereEqual(self, key, value):
        return self.WhereCheck(lambda entry : entry[key] == value)
    
    def WhereCheck(self, check):
        filteredData = list(filter(check, copy.deepcopy(self.data)))
        return Table(filteredData)

    def ForEach(self, action):
        mutatedData = copy.deepcopy(self.data)
        for index, entry in enumerate(mutatedData):
            mutatedData[index] = action(index, entry)
        return Table(mutatedData);

    def GetAllDistinctValues(self, key):
        return set(self.GetAllValues(key))

    def GetAllValues(self, key):
        return [entry[key] for entry in self.data]

__name__ = "Table"