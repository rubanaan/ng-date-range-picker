app.service('DateService', ['$state', '$filter', 'CallbackService',
    function($state, $filter, CallbackService)
    {
        //-- private variables
        var self = this;

        //-- public variables
        self.currentTabIndex = 0;

        //-- public methods
        self.autoCompleteSearch     = autoCompleteSearch;
        self.changeTab              = changeTab;
        self.watchTabChange         = watchTabChange;

        /**
         * Get the client search.
         * @param query
         * @param clients
         * @returns {*}
         */
        function autoCompleteSearch (query, clients)
        {
            return query ? $filter('clientSearch')(clients, query) : clients;
        }

        /**
         * Changes the tab and callback.
         * @param name
         */
        function changeTab (name)
        {
            self.currentTabIndex = tabs.indexOf(name);

            if (self.currentTabIndex > -1)
            {
                CallbackService.executeCallback('ClientTabChange', self.currentTabIndex);
            }
        }

        /**
         * Watch the tab change.
         * @param current
         * @param old
         */
        function watchTabChange (current, old)
        {
            var projectIndex = tabs.indexOf('projects');

            if ((projectIndex !== current || $state.current.name !== 'client.detail.tab.project'))
            {
                $state.go('client.detail.tab', {tab: tabs[current]}, {notify: false, location:  current === old ? 'replace' : true});
            }

        }
    }
]);