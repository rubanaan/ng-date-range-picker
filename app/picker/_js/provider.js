app.provider('picker',
    function picker ()
    {
        var massagePath = "X";
        var cancelLabel = "Sluiten";
        var okLabel = "Opslaan";

        var customHeader = {
            date: 'ddd, MMM DD',
            dateTime: 'ddd, MMM DD HH:mm',
            time: 'HH:mm'
        };


        //date picker configuration
        var daysNames = [
            {'single': 'Z', 'shortName': 'Zo', 'fullName': 'Zondag'},
            {'single': 'M', 'shortName': 'Ma', 'fullName': 'Maandag'},
            {'single': 'D', 'shortName': 'Di', 'fullName': 'Dinsdag'},
            {'single': 'W', 'shortName': 'Wo', 'fullName': 'Woensdag'},
            {'single': 'D', 'shortName': 'Do', 'fullName': 'Donderdag'},
            {'single': 'V', 'shortName': 'Vr', 'fullName': 'Vrijdag'},
            {'single': 'Z', 'shortName': 'Za', 'fullName': 'Zaterdag'}
        ];

        var dayHeader = "shortName";

        var monthNames = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

        //range picker configuration
        var rangeDivider = '-';

        var rangeDefaultList = [
            {
                label:'Deze maand',
                startDate:moment().startOf('month'),
                endDate: moment().endOf('month')
            },
            {
                label: 'Vorige maand',
                startDate:moment().subtract(1,'month').startOf('month'),
                endDate: moment().subtract(1,'month').endOf('month')
            },
            {
                label: 'Dit kwartaal',
                startDate: moment().startOf('quarter'),
                endDate: moment().endOf('quarter')
            },
            {
                label: 'Vorig kwartaal',
                startDate: moment().subtract(3,'month').startOf('quarter'),
                endDate: moment().subtract(3,'month').endOf('quarter')
            },
            {
                label: 'Het hele jaar (' + moment().format('YYYY') + ')',
                startDate: moment().startOf('year'),
                endDate: moment().endOf('year')
            },
            {
                label: 'Vorig jaar',
                startDate: 'custom'
            }
        ];

        var rangeCustomStartEnd = ['Begin datum', 'Eind datum'];


        return {
            setMassagePath: function (param)
            {
                massagePath = param;
            },

            setDivider: function (value)
            {
                rangeDivider = value;
            },

            setDaysNames: function (array)
            {
                daysNames = array;
            },

            setMonthNames: function (array)
            {
                monthNames = array;
            },

            setDayHeader: function (param)
            {
                dayHeader = param;
            },

            setOkLabel: function (param)
            {
                okLabel = param;
            },

            setCancelLabel: function (param)
            {
                cancelLabel = param;
            },

            setRangeDefaultList: function (array)
            {
                rangeDefaultList = array;
            },

            setRangeCustomStartEnd: function (array)
            {
                rangeCustomStartEnd = array;
            },

            setCustomHeader: function (obj)
            {
                if (!angular.isUndefined(obj.date))
                {
                    customHeader.date = obj.date;
                }
                if (!angular.isUndefined(obj.dateTime))
                {
                    customHeader.dateTime = obj.dateTime;
                }
                if (!angular.isUndefined(obj.time))
                {
                    customHeader.time = obj.time;
                }
            },

            $get: function ()
            {
                return {
                    massagePath: massagePath,
                    cancelLabel: cancelLabel,
                    okLabel: okLabel,

                    daysNames: daysNames,
                    monthNames: monthNames,
                    dayHeader: dayHeader,
                    customHeader: customHeader,

                    rangeDivider: rangeDivider,
                    rangeCustomStartEnd: rangeCustomStartEnd,
                    rangeDefaultList: rangeDefaultList
                }
            }
        }
    }
);