var picker = angular.module('ngDateRangePicker', []);

picker.provider('pickerProvider',
    function ()
    {
        var massagePath = "X";
        var cancelLabel = "Sluiten";
        var okLabel     = "Opslaan";

        var customHeader = {
            date:     'ddd, MMM DD',
            dateTime: 'ddd, MMM DD HH:mm',
            time:     'HH:mm'
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
        var dayHeader       = "shortName";
        var monthNames      = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
        var shortMonthNames = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];

        //range picker configuration
        var rangeDivider = '-';

        var rangeDefaultList = [
            {
                label: monthNames[moment().month()] + ', ' + moment().format('YYYY'),
                startDate: moment().startOf('month'),
                endDate: moment().endOf('month')
            },
            {
                label: monthNames[moment().subtract(1, 'month').month()] + ', ' + moment().subtract(1, 'month').format('YYYY'),
                startDate: moment().subtract(1, 'month').startOf('month'),
                endDate: moment().subtract(1, 'month').endOf('month')
            },
            {
                label: monthNames[moment().subtract(2, 'month').month()] + ', ' + moment().subtract(2, 'month').format('YYYY'),
                startDate: moment().subtract(2, 'month').startOf('month'),
                endDate: moment().subtract(2, 'month').endOf('month')
            },
            {},
            {
                label: 'Dit kwartaal (Q' + moment().quarter() + ')',
                startDate: moment().startOf('quarter'),
                endDate: moment().endOf('quarter')
            },
            {
                label: 'Vorig kwartaal (Q' + moment().subtract(3, 'month').quarter() + ')',
                startDate: moment().subtract(3, 'month').startOf('quarter'),
                endDate: moment().subtract(3, 'month').endOf('quarter')
            },
            {},
            {
                label: 'Dit jaar (' + moment().format('YYYY') + ')',
                startDate: moment().startOf('year'),
                endDate: moment().endOf('year')
            },
            {
                label: 'Vorig jaar (' + moment().subtract(1, 'year').format('YYYY') + ')',
                startDate: moment().subtract(1, 'year').startOf('year'),
                endDate: moment().subtract(1, 'year').endOf('year')
            }
        ];

        var rangeCustomStartEnd = ['Begin datum', 'Eind datum'];

        var startDate = rangeDefaultList[0].startDate;
        var endDate   = rangeDefaultList[0].endDate;

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

            setShortMonthNames: function (array)
            {
                shortMonthNames = array;
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

            setStartDate: function (param)
            {
                startDate = param
            },

            setEndDate: function (param)
            {
                endDate = param
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
                    startDate: startDate,
                    endDate: endDate,

                    massagePath: massagePath,
                    cancelLabel: cancelLabel,
                    okLabel: okLabel,

                    daysNames: daysNames,
                    monthNames: monthNames,
                    shortMonthNames: shortMonthNames,
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