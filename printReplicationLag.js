function printReplicationLag() {

        var rsStatus = rs.status();
        var numSecondaries = 0;
        var secondaryOptimes = [];
        var primaryOptime = 0;

        for (var i = 0; i < rsStatus.members.length; i++) {

                if( rsStatus.members[i].stateStr == "PRIMARY" )
                        primaryOptime = rsStatus.members[i].optime.t;

                else if ( rsStatus.members[i].stateStr == "SECONDARY" ) {
                        var secondaryStat = {};
                        secondaryStat.name = rsStatus.members[i].name;
                        secondaryStat.optime = rsStatus.members[i].optime.t;
                        secondaryOptimes[ numSecondaries ] = secondaryStat;
                        numSecondaries++;
                }
        }

        for (var i = 0; i < secondaryOptimes.length; i++) {
                print( secondaryOptimes[i].name + " is lagging "
                        + ( primaryOptime - secondaryOptimes[i].optime ) + " ms");
        }
}
